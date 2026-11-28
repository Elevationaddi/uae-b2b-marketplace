# One-time bootstrap, applied by an operator with Owner rights after founder approval:
# - Terraform state storage (private, versioned, Entra ID only, delete lock)
# - one certificates Key Vault per environment for the public TLS certificate
# Keep this stack's own state local and offline (it holds no secrets), or import it later.

terraform {
  required_version = ">= 1.9.0, < 2.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 4.0.0, < 5.0.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id     = var.subscription_id
  storage_use_azuread = true
}

variable "subscription_id" {
  type = string
}

variable "location" {
  type    = string
  default = "uaenorth"
}

variable "deployer_principal_ids" {
  description = "Object IDs of the CI deployment identities (GitHub OIDC) per environment."
  type        = object({ staging = string, production = string })
}

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "state" {
  name     = "rg-uaeb2b-tfstate"
  location = var.location
  tags     = { application = "uae-b2b-marketplace", managed_by = "terraform-bootstrap" }
}

resource "azurerm_management_lock" "state" {
  name       = "do-not-delete"
  scope      = azurerm_resource_group.state.id
  lock_level = "CanNotDelete"
  notes      = "Terraform state and TLS certificates."
}

resource "azurerm_storage_account" "state" {
  name                            = "stuaeb2btfstate"
  location                        = azurerm_resource_group.state.location
  resource_group_name             = azurerm_resource_group.state.name
  account_tier                    = "Standard"
  account_replication_type        = "ZRS"
  min_tls_version                 = "TLS1_2"
  shared_access_key_enabled       = false
  allow_nested_items_to_be_public = false

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 90
    }
  }
}

resource "azurerm_storage_container" "state" {
  name                  = "tfstate"
  storage_account_id    = azurerm_storage_account.state.id
  container_access_type = "private"
}

resource "azurerm_role_assignment" "state" {
  for_each             = var.deployer_principal_ids
  scope                = azurerm_storage_container.state.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = each.value
}

resource "azurerm_key_vault" "certificates" {
  for_each                   = { staging = "stg", production = "prd" }
  name                       = "kv-uaeb2b-cert-${each.value}"
  location                   = azurerm_resource_group.state.location
  resource_group_name        = azurerm_resource_group.state.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization  = true
  purge_protection_enabled   = true
  soft_delete_retention_days = 90
  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices" # Application Gateway reads certificates as a trusted service
  }
}

output "state_storage_account" {
  value = azurerm_storage_account.state.name
}

output "certificate_key_vault_ids" {
  value = { for k, v in azurerm_key_vault.certificates : k => v.id }
}
