data "azurerm_client_config" "current" {}

locals {
  env_short = var.environment == "production" ? "prd" : "stg"
  base      = "${var.name_prefix}-${local.env_short}"
  # Storage accounts and registries: lowercase alphanumerics only, globally unique.
  compact = "${var.name_prefix}${local.env_short}"
  tags    = merge({
    application = "uae-b2b-marketplace"
    environment = var.environment
    managed_by  = "terraform"
    data_class  = var.environment == "production" ? "confidential" : "test-only"
  }, var.tags)

  registry_id           = var.create_container_registry ? azurerm_container_registry.this[0].id : var.existing_container_registry_id
  registry_login_server = var.create_container_registry ? azurerm_container_registry.this[0].login_server : var.existing_container_registry_login_server
}

resource "azurerm_resource_group" "this" {
  name     = "rg-${local.base}"
  location = var.location
  tags     = local.tags
}

# One identity for all apps and jobs: pulls images, reads Key Vault secrets, uses Blob storage.
resource "azurerm_user_assigned_identity" "apps" {
  name                = "id-${local.base}-apps"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags
}

# ---------------------------------------------------------------- registry
resource "azurerm_container_registry" "this" {
  count                         = var.create_container_registry ? 1 : 0
  name                          = "acr${local.compact}"
  location                      = azurerm_resource_group.this.location
  resource_group_name           = azurerm_resource_group.this.name
  sku                           = var.container_registry_sku
  admin_enabled                 = false # pulls use managed identity, pushes use CI OIDC
  public_network_access_enabled = true  # private endpoints need Premium; access is Entra ID only
  tags                          = local.tags
}

resource "azurerm_role_assignment" "acr_pull" {
  scope                = local.registry_id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

# ---------------------------------------------------------------- Key Vault
resource "azurerm_key_vault" "this" {
  name                          = "kv-${local.base}"
  location                      = azurerm_resource_group.this.location
  resource_group_name           = azurerm_resource_group.this.name
  tenant_id                     = data.azurerm_client_config.current.tenant_id
  sku_name                      = "standard"
  enable_rbac_authorization     = true
  purge_protection_enabled      = true
  soft_delete_retention_days    = 90
  public_network_access_enabled = false
  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices"
  }
  tags = local.tags
}

resource "azurerm_role_assignment" "kv_secrets_user" {
  scope                = azurerm_key_vault.this.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

resource "azurerm_role_assignment" "certificates_reader" {
  scope                = var.certificate_key_vault_id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

# ---------------------------------------------------------------- Blob storage
resource "azurerm_storage_account" "this" {
  name                              = "st${local.compact}"
  location                          = azurerm_resource_group.this.location
  resource_group_name               = azurerm_resource_group.this.name
  account_kind                      = "StorageV2"
  account_tier                      = "Standard"
  account_replication_type          = var.storage_replication
  min_tls_version                   = "TLS1_2"
  https_traffic_only_enabled        = true
  shared_access_key_enabled         = false # Entra ID (managed identity) only
  allow_nested_items_to_be_public   = false
  public_network_access_enabled     = false
  infrastructure_encryption_enabled = true

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = var.blob_soft_delete_days
    }
    container_delete_retention_policy {
      days = var.blob_soft_delete_days
    }
  }

  network_rules {
    default_action = "Deny"
    bypass         = ["AzureServices"]
  }

  tags = local.tags
}

resource "azurerm_storage_container" "this" {
  for_each              = toset(["private", "media", "backups"])
  name                  = each.key
  storage_account_id    = azurerm_storage_account.this.id
  container_access_type = "private"
}

resource "azurerm_storage_container_immutability_policy" "backups" {
  storage_container_resource_manager_id = azurerm_storage_container.this["backups"].id
  immutability_period_in_days           = var.backup_immutability_days
  protected_append_writes_all_enabled   = false
}

resource "azurerm_role_assignment" "blob_contributor" {
  scope                = azurerm_storage_account.this.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

# ---------------------------------------------------------------- PostgreSQL
resource "random_password" "postgres_admin" {
  length           = 40
  special          = true
  override_special = "-_.~"
}

resource "azurerm_postgresql_flexible_server" "this" {
  name                          = "psql-${local.base}"
  location                      = azurerm_resource_group.this.location
  resource_group_name           = azurerm_resource_group.this.name
  version                       = "16"
  sku_name                      = var.postgres.sku_name
  storage_mb                    = var.postgres.storage_mb
  auto_grow_enabled             = true
  backup_retention_days         = var.postgres.backup_retention_days
  geo_redundant_backup_enabled  = var.postgres.geo_redundant_backup
  delegated_subnet_id           = azurerm_subnet.postgres.id
  private_dns_zone_id           = azurerm_private_dns_zone.postgres.id
  public_network_access_enabled = false
  zone                          = var.postgres.zone
  administrator_login           = "mpadmin"
  administrator_password        = random_password.postgres_admin.result

  authentication {
    active_directory_auth_enabled = true
    password_auth_enabled         = true
    tenant_id                     = data.azurerm_client_config.current.tenant_id
  }

  dynamic "high_availability" {
    for_each = var.postgres.high_availability ? [1] : []
    content {
      mode                      = "ZoneRedundant"
      standby_availability_zone = var.postgres.standby_zone
    }
  }

  maintenance_window {
    day_of_week  = 5 # Friday
    start_hour   = 22
    start_minute = 0 # 22:00 UTC = 02:00 Saturday Dubai
  }

  tags = local.tags

  depends_on = [azurerm_private_dns_zone_virtual_network_link.postgres]

  lifecycle {
    # Azure may swap primary and standby zones after a failover.
    ignore_changes = [zone, high_availability[0].standby_availability_zone]
  }
}

resource "azurerm_postgresql_flexible_server_database" "app" {
  name      = "marketplace"
  server_id = azurerm_postgresql_flexible_server.this.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_postgresql_flexible_server_configuration" "settings" {
  for_each = {
    "require_secure_transport"            = "on"
    "ssl_min_protocol_version"            = "TLSv1.2"
    "log_connections"                     = "on"
    "log_disconnections"                  = "on"
    "shared_preload_libraries"            = "pgaudit,pg_stat_statements"
    "pgaudit.log"                         = "ddl,role"
    "idle_in_transaction_session_timeout" = "60000"
  }
  name      = each.key
  server_id = azurerm_postgresql_flexible_server.this.id
  value     = each.value
}

# ---------------------------------------------------------------- Redis
resource "azurerm_redis_cache" "this" {
  name                          = "redis-${local.base}"
  location                      = azurerm_resource_group.this.location
  resource_group_name           = azurerm_resource_group.this.name
  sku_name                      = var.redis.sku_name
  family                        = "C"
  capacity                      = var.redis.capacity
  minimum_tls_version           = "1.2"
  non_ssl_port_enabled          = false
  public_network_access_enabled = false
  redis_version                 = "6"

  redis_configuration {
    maxmemory_policy = "noeviction" # BullMQ requires keys never to be evicted
  }

  tags = local.tags
}

# ---------------------------------------------------------------- generated secrets
# Generated values live in Terraform state: the state storage account is private, versioned and
# readable only by the deployment principal (see bootstrap/). Third-party credentials (PSP, email)
# are never in Terraform: an operator sets them in Key Vault when the founder approves (8C/8D).
resource "random_password" "session_secret" {
  length  = 64
  special = false
}

resource "random_bytes" "mfa_key" {
  length = 32
}

locals {
  generated_secrets = {
    "session-secret"     = random_password.session_secret.result
    "mfa-encryption-key" = random_bytes.mfa_key.base64
    "database-url"       = format(
      "postgresql://%s:%s@%s:5432/%s?sslmode=require",
      azurerm_postgresql_flexible_server.this.administrator_login,
      random_password.postgres_admin.result,
      azurerm_postgresql_flexible_server.this.fqdn,
      azurerm_postgresql_flexible_server_database.app.name,
    )
    "redis-url" = format(
      "rediss://:%s@%s:%d",
      azurerm_redis_cache.this.primary_access_key,
      azurerm_redis_cache.this.hostname,
      azurerm_redis_cache.this.ssl_port,
    )
  }
}

resource "azurerm_key_vault_secret" "generated" {
  for_each     = local.generated_secrets
  name         = each.key
  value        = each.value
  key_vault_id = azurerm_key_vault.this.id
  content_type = "text/plain"
  tags         = local.tags

  # The deployment principal reaches the vault through the private endpoint (self-hosted runner in
  # the VNet) or a temporary firewall exception during apply; see infra/azure/README.md.
  depends_on = [azurerm_private_endpoint.this]
}
