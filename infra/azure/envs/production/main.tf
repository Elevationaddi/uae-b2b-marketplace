terraform {
  required_version = ">= 1.9.0, < 2.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 4.0.0, < 5.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.6.0, < 4.0.0"
    }
  }
  # Partial configuration: values come from backend.hcl (see backend.hcl.example), created by
  # ../../bootstrap. CI validates with -backend=false and never applies (Phase 8A).
  backend "azurerm" {}
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
  subscription_id     = var.subscription_id
  storage_use_azuread = true
}

variable "subscription_id" {
  description = "Azure subscription for the production environment."
  type        = string
}

variable "image_tag" {
  description = "Git commit SHA of the images to deploy."
  type        = string
}

variable "public_hostnames" {
  type = object({ web = string, admin = string })
}

variable "tls_certificate_secret_id" {
  description = "Versionless secret ID of the public TLS certificate in the certificates vault."
  type        = string
}

variable "certificate_key_vault_id" {
  description = "Certificates Key Vault created by ../../bootstrap."
  type        = string
}

variable "alert_emails" {
  type = list(string)
}

variable "monthly_budget_usd" {
  type = number
}

variable "budget_start_date" {
  type = string
}

module "platform" {
  source      = "../../modules/platform"
  environment = "production"
  name_prefix = "uaeb2b"
  vnet_cidr   = "10.40.0.0/16"

  enable_app_gateway        = true
  public_hostnames          = var.public_hostnames
  tls_certificate_secret_id = var.tls_certificate_secret_id
  certificate_key_vault_id  = var.certificate_key_vault_id

  image_tag                 = var.image_tag
  create_container_registry = true
  container_registry_sku    = "Standard"

  apps = {
    web    = { cpu = 1, memory = "2Gi", min_replicas = 2, max_replicas = 6 }
    api    = { cpu = 1, memory = "2Gi", min_replicas = 2, max_replicas = 6 }
    worker = { cpu = 0.5, memory = "1Gi", min_replicas = 1, max_replicas = 3 }
    clamav = { cpu = 1.5, memory = "3Gi", min_replicas = 1, max_replicas = 2 }
  }
  enable_clamav = true

  postgres = {
    sku_name              = "GP_Standard_D2ds_v5"
    storage_mb            = 131072
    backup_retention_days = 35
    high_availability     = true
    zone                  = "1"
    standby_zone          = "2"
    geo_redundant_backup  = false # needs UAE Central access (restricted region); see architecture.md
  }
  redis               = { sku_name = "Standard", capacity = 1 }
  storage_replication = "ZRS"

  log_retention_days = 90
  alert_emails       = var.alert_emails
  monthly_budget_usd = var.monthly_budget_usd
  budget_start_date  = var.budget_start_date

  # Production stays closed until 8H approval. The application refuses to start until live
  # payment, email and scanner credentials exist (T38) - intended: nothing here enables them.
  app_settings = {
    NODE_ENV                   = "production"
    PAYMENT_MODE               = "disabled"
    EMAIL_PROVIDER             = "disabled"
    FILE_SCANNER               = "live"
    TRADING_ENABLED            = "false"
    FEATURE_REAL_PAYMENTS      = "false"
    FEATURE_SUBSCRIPTIONS      = "false"
    FEATURE_MILESTONE_PAYMENTS = "false"
    RETENTION_DELETION_ENABLED = "false"
    RESERVATION_MINUTES        = "15"
    QUOTE_PAYMENT_WINDOW_HOURS = "72"
    # COMMISSION_BPS and TAX_STANDARD_BPS are deliberately absent: production refuses to start
    # until approved values are set (D04 approved at 1000 bps, but D06 tax treatment is not).
  }
}

output "gateway_public_ip" {
  value = module.platform.gateway_public_ip
}

output "container_registry_id" {
  value = module.platform.container_registry_id
}

output "container_registry_login_server" {
  value = module.platform.container_registry_login_server
}
