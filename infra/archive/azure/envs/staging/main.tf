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
  description = "Azure subscription for the staging environment."
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

variable "allowed_ip_ranges" {
  description = "Who may reach staging (office, VPN, testers)."
  type        = list(string)
}

variable "container_registry_id" {
  description = "Registry created by the production stack (shared, images promoted by digest)."
  type        = string
}

variable "container_registry_login_server" {
  type = string
}

module "platform" {
  source      = "../../modules/platform"
  environment = "staging"
  name_prefix = "uaeb2b"
  vnet_cidr   = "10.30.0.0/16"

  enable_app_gateway        = false
  public_hostnames          = var.public_hostnames
  tls_certificate_secret_id = var.tls_certificate_secret_id
  certificate_key_vault_id  = var.certificate_key_vault_id
  allowed_ip_ranges         = var.allowed_ip_ranges

  image_tag                                = var.image_tag
  create_container_registry                = false
  existing_container_registry_id           = var.container_registry_id
  existing_container_registry_login_server = var.container_registry_login_server

  apps = {
    web    = { cpu = 0.5, memory = "1Gi", min_replicas = 1, max_replicas = 2 }
    api    = { cpu = 0.5, memory = "1Gi", min_replicas = 1, max_replicas = 2 }
    worker = { cpu = 0.25, memory = "0.5Gi", min_replicas = 1, max_replicas = 1 }
    clamav = { cpu = 1, memory = "2Gi", min_replicas = 1, max_replicas = 1 }
  }
  enable_clamav = true

  postgres = {
    sku_name              = "B_Standard_B2s"
    storage_mb            = 32768
    backup_retention_days = 7
    high_availability     = false
  }
  redis               = { sku_name = "Basic", capacity = 1 }
  storage_replication = "LRS"

  log_retention_days = 30
  log_daily_cap_gb   = 1
  alert_emails       = var.alert_emails
  monthly_budget_usd = var.monthly_budget_usd
  budget_start_date  = var.budget_start_date

  # Sandbox only: labelled adapters, no live services (founder instruction, 28 Nov 2026).
  app_settings = {
    NODE_ENV                   = "production"
    PAYMENT_MODE               = "mock"
    EMAIL_PROVIDER             = "smtp-dev"
    FILE_SCANNER               = "sandbox-eicar"
    TRADING_ENABLED            = "false"
    FEATURE_REAL_PAYMENTS      = "false"
    FEATURE_SUBSCRIPTIONS      = "false"
    FEATURE_MILESTONE_PAYMENTS = "false"
    RETENTION_DELETION_ENABLED = "false"
    APP_NAME                   = "B2B Marketplace (staging)"
    COMMISSION_BPS             = "1000"
    TAX_STANDARD_BPS           = "500"
    RESERVATION_MINUTES        = "15"
    QUOTE_PAYMENT_WINDOW_HOURS = "72"
  }
}

output "web_fqdn" {
  value = module.platform.web_fqdn
}

output "environment_verification_id" {
  value = module.platform.environment_verification_id
}
