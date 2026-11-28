resource "azurerm_container_app_environment" "this" {
  name                           = "cae-${local.base}"
  location                       = azurerm_resource_group.this.location
  resource_group_name            = azurerm_resource_group.this.name
  log_analytics_workspace_id     = azurerm_log_analytics_workspace.this.id
  infrastructure_subnet_id       = azurerm_subnet.apps.id
  internal_load_balancer_enabled = var.enable_app_gateway # production: reachable only through the gateway
  zone_redundancy_enabled        = var.environment == "production"

  workload_profile {
    name                  = "Consumption"
    workload_profile_type = "Consumption"
  }

  # Reads the TLS certificate for the custom domains from Key Vault.
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.apps.id]
  }

  tags = local.tags

  depends_on = [azurerm_role_assignment.kv_secrets_user, azurerm_role_assignment.certificates_reader]
}

# The web app routes by Host header (buyer site vs admin portal, A03; apps/web/src/middleware.ts),
# so both public host names are bound to it as custom domains with the same certificate the
# gateway uses. The gateway forwards the original Host header.
resource "azurerm_container_app_environment_certificate" "public" {
  name                         = "public-hosts"
  container_app_environment_id = azurerm_container_app_environment.this.id
  certificate_key_vault {
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = var.tls_certificate_secret_id
  }
}

resource "azurerm_container_app_custom_domain" "web" {
  for_each                                 = { web = var.public_hostnames.web, admin = var.public_hostnames.admin }
  name                                     = each.value
  container_app_id                         = azurerm_container_app.app["web"].id
  container_app_environment_certificate_id = azurerm_container_app_environment_certificate.public.id
  certificate_binding_type                 = "SniEnabled"
}

locals {
  web_origin   = "https://${var.public_hostnames.web}"
  admin_origin = "https://${var.public_hostnames.admin}"

  # Values every app receives. App-specific overrides are merged below. Names match
  # packages/config/src/env.ts; entries marked (8B) need the code changes C-20/C-21 first.
  common_settings = merge({
    APP_ENV                               = var.environment # (8B) staging profile, C-20
    WEB_ORIGIN                            = local.web_origin
    ADMIN_ORIGIN                          = local.admin_origin
    API_ORIGIN                            = local.web_origin # browsers reach the API through the web origin
    TRUST_PROXY                           = "uniquelocal"
    LOG_LEVEL                             = "info"
    STORAGE_DRIVER                        = "azure-blob" # (8B) C-21
    STORAGE_ACCOUNT_URL                   = azurerm_storage_account.this.primary_blob_endpoint
    STORAGE_BUCKET                        = azurerm_storage_container.this["private"].name
    STORAGE_MEDIA_BUCKET                  = azurerm_storage_container.this["media"].name
    STORAGE_REGION                        = var.location
    AZURE_CLIENT_ID                       = azurerm_user_assigned_identity.apps.client_id
    FILE_SCANNER_URL                      = var.enable_clamav ? "tcp://clamav:3310" : "" # (8D)
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.this.connection_string
  }, var.app_settings)

  secret_env = {
    DATABASE_URL       = "database-url"
    REDIS_URL          = "redis-url"
    SESSION_SECRET     = "session-secret"
    MFA_ENCRYPTION_KEY = "mfa-encryption-key"
  }

  app_definitions = {
    web = {
      image      = "marketplace-web"
      port       = 3000
      probe_path = null
      ingress    = true
      secrets    = {} # the web app holds no secrets; it proxies /api/v1 to the API
      extra      = { API_INTERNAL_ORIGIN = "http://api", PORT = "3000" }
    }
    api = {
      image      = "marketplace-api"
      port       = 4000
      probe_path = "/api/v1/health/ready"
      ingress    = true # environment-internal only (external_enabled = false)
      secrets    = local.secret_env
      extra      = { API_PORT = "4000" }
    }
    worker = {
      image      = "marketplace-worker"
      port       = 4100
      probe_path = "/health/ready"
      ingress    = false
      secrets    = local.secret_env
      extra      = { WORKER_HEALTH_PORT = "4100" }
    }
  }
}

resource "azurerm_container_app" "app" {
  for_each                     = local.app_definitions
  name                         = each.key
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = azurerm_resource_group.this.name
  revision_mode                = "Single"
  workload_profile_name        = "Consumption"
  tags                         = local.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.apps.id]
  }

  registry {
    server   = local.registry_login_server
    identity = azurerm_user_assigned_identity.apps.id
  }

  dynamic "secret" {
    for_each = toset(values(each.value.secrets))
    content {
      name                = secret.value
      key_vault_secret_id = azurerm_key_vault_secret.generated[secret.value].versionless_id
      identity            = azurerm_user_assigned_identity.apps.id
    }
  }

  template {
    min_replicas = var.apps[each.key].min_replicas
    max_replicas = var.apps[each.key].max_replicas

    container {
      name   = each.key
      image  = "${local.registry_login_server}/${each.value.image}:${var.image_tag}"
      cpu    = var.apps[each.key].cpu
      memory = var.apps[each.key].memory

      dynamic "env" {
        for_each = merge(local.common_settings, each.value.extra)
        content {
          name  = env.key
          value = env.value
        }
      }

      dynamic "env" {
        for_each = each.value.secrets
        content {
          name        = env.key
          secret_name = env.value
        }
      }

      dynamic "liveness_probe" {
        for_each = each.value.probe_path == null ? [] : [1]
        content {
          transport = "HTTP"
          port      = each.value.port
          path      = each.value.probe_path
        }
      }

      dynamic "readiness_probe" {
        for_each = each.value.probe_path == null ? [] : [1]
        content {
          transport = "HTTP"
          port      = each.value.port
          path      = each.value.probe_path
        }
      }
    }
  }

  dynamic "ingress" {
    for_each = each.value.ingress ? [1] : []
    content {
      # web: public (staging, IP-restricted) or VNet-internal behind the gateway (production).
      # api: reachable only from other apps in the environment (http://api).
      external_enabled = each.key == "web"
      target_port      = each.value.port
      transport        = "auto"

      traffic_weight {
        latest_revision = true
        percentage      = 100
      }

      dynamic "ip_security_restriction" {
        for_each = each.key == "web" && !var.enable_app_gateway ? var.allowed_ip_ranges : []
        content {
          name             = "allow-${replace(ip_security_restriction.value, "/[./]/", "-")}"
          ip_address_range = ip_security_restriction.value
          action           = "Allow"
        }
      }
    }
  }

  depends_on = [azurerm_role_assignment.acr_pull, azurerm_role_assignment.kv_secrets_user]
}

# Internal malware scanner (8D option A). Signature updates come from the official mirror.
resource "azurerm_container_app" "clamav" {
  count                        = var.enable_clamav ? 1 : 0
  name                         = "clamav"
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = azurerm_resource_group.this.name
  revision_mode                = "Single"
  workload_profile_name        = "Consumption"
  tags                         = local.tags

  template {
    min_replicas = var.apps["clamav"].min_replicas
    max_replicas = var.apps["clamav"].max_replicas
    container {
      name   = "clamav"
      image  = "docker.io/clamav/clamav:stable"
      cpu    = var.apps["clamav"].cpu
      memory = var.apps["clamav"].memory
    }
  }

  ingress {
    external_enabled = false
    target_port      = 3310
    exposed_port     = 3310
    transport        = "tcp"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

# ---------------------------------------------------------------- jobs
# migrate: additive Prisma migrations, started manually by the deployment pipeline after approval.
# backup: nightly logical dump to the immutable backups container (in addition to PITR).
locals {
  jobs = {
    migrate = {
      image   = "marketplace-api"
      command = ["pnpm", "--filter", "@app/db", "exec", "prisma", "migrate", "deploy"]
      cron    = null
    }
    backup = {
      image   = "marketplace-ops" # (8B) pg_dump + upload with managed identity
      command = ["/usr/local/bin/backup-to-blob"]
      cron    = "0 22 * * *" # 22:00 UTC = 02:00 Dubai
    }
  }
}

resource "azurerm_container_app_job" "this" {
  for_each                     = local.jobs
  name                         = "job-${each.key}"
  location                     = azurerm_resource_group.this.location
  resource_group_name          = azurerm_resource_group.this.name
  container_app_environment_id = azurerm_container_app_environment.this.id
  workload_profile_name        = "Consumption"
  replica_timeout_in_seconds   = 3600
  replica_retry_limit          = 0
  tags                         = local.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.apps.id]
  }

  registry {
    server   = local.registry_login_server
    identity = azurerm_user_assigned_identity.apps.id
  }

  secret {
    name                = "database-url"
    key_vault_secret_id = azurerm_key_vault_secret.generated["database-url"].versionless_id
    identity            = azurerm_user_assigned_identity.apps.id
  }

  dynamic "manual_trigger_config" {
    for_each = each.value.cron == null ? [1] : []
    content {
      parallelism              = 1
      replica_completion_count = 1
    }
  }

  dynamic "schedule_trigger_config" {
    for_each = each.value.cron == null ? [] : [1]
    content {
      cron_expression          = each.value.cron
      parallelism              = 1
      replica_completion_count = 1
    }
  }

  template {
    container {
      name    = each.key
      image   = "${local.registry_login_server}/${each.value.image}:${var.image_tag}"
      command = each.value.command
      cpu     = 0.5
      memory  = "1Gi"
      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }
      env {
        name  = "BACKUP_CONTAINER_URL"
        value = "${azurerm_storage_account.this.primary_blob_endpoint}${azurerm_storage_container.this["backups"].name}"
      }
      env {
        name  = "AZURE_CLIENT_ID"
        value = azurerm_user_assigned_identity.apps.client_id
      }
    }
  }

  depends_on = [azurerm_role_assignment.acr_pull, azurerm_role_assignment.kv_secrets_user]
}
