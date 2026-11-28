variable "environment" {
  description = "staging or production. Drives names, sizing defaults and tags."
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be staging or production."
  }
}

variable "location" {
  description = "Azure region. UAE North is the approved candidate (D12); data residency (A14)."
  type        = string
  default     = "uaenorth"
}

variable "name_prefix" {
  description = "Short lowercase prefix for resource names (letters and digits, 3-10 chars)."
  type        = string
  validation {
    condition     = can(regex("^[a-z][a-z0-9]{2,9}$", var.name_prefix))
    error_message = "name_prefix must be 3-10 lowercase letters or digits, starting with a letter."
  }
}

variable "tags" {
  description = "Extra tags applied to every resource."
  type        = map(string)
  default     = {}
}

# ---------------------------------------------------------------- network
variable "vnet_cidr" {
  description = "Address space of the environment VNet. Staging and production must not overlap."
  type        = string
}

# ---------------------------------------------------------------- edge
variable "enable_app_gateway" {
  description = "Production: Application Gateway WAF v2 in front of an internal Container Apps environment. Staging: false (public ingress restricted to allowed_ip_ranges)."
  type        = bool
}

variable "public_hostnames" {
  description = "Host names served by the web app: { web = \"www.example.ae\", admin = \"admin.example.ae\" }. Admin must differ from web (A03)."
  type        = object({ web = string, admin = string })
  validation {
    condition     = var.public_hostnames.web != var.public_hostnames.admin
    error_message = "The admin host must differ from the web host (A03)."
  }
}

variable "tls_certificate_secret_id" {
  description = "Versionless Key Vault secret ID of the TLS certificate (PFX) covering both public host names. Used by the gateway (production) and the web app custom domains (both environments). Imported or issued in 8B; never committed."
  type        = string
}

variable "certificate_key_vault_id" {
  description = "Resource ID of the certificates Key Vault created by bootstrap/ that holds the public TLS certificate. The apps identity is granted read access to it."
  type        = string
}

variable "allowed_ip_ranges" {
  description = "CIDR ranges allowed to reach staging ingress (office, VPN, penetration testers). Ignored when enable_app_gateway is true."
  type        = list(string)
  default     = []
}

# ---------------------------------------------------------------- containers
variable "image_tag" {
  description = "Immutable image tag (git commit SHA) deployed to every app. Images are built and scanned in CI."
  type        = string
}

variable "apps" {
  description = "Sizing per app. cpu/memory must be a valid Container Apps consumption pair (0.25/0.5Gi, 0.5/1Gi, 1/2Gi, 1.5/3Gi, 2/4Gi)."
  type = map(object({
    cpu          = number
    memory       = string
    min_replicas = number
    max_replicas = number
  }))
}

variable "enable_clamav" {
  description = "Run an internal ClamAV scanner app (8D option A). False if Defender for Storage is chosen."
  type        = bool
  default     = true
}

variable "container_registry_sku" {
  description = "Basic or Standard. Premium is only needed for private endpoints or geo-replication."
  type        = string
  default     = "Standard"
}

variable "create_container_registry" {
  description = "Create the registry in this environment. Production owns it; staging reuses it via existing_container_registry_id."
  type        = bool
  default     = false
}

variable "existing_container_registry_id" {
  description = "Resource ID of a registry created elsewhere (used when create_container_registry is false)."
  type        = string
  default     = null
}

variable "existing_container_registry_login_server" {
  description = "Login server of the existing registry, e.g. example.azurecr.io."
  type        = string
  default     = null
}

# ---------------------------------------------------------------- data
variable "postgres" {
  description = "PostgreSQL flexible server settings."
  type = object({
    sku_name              = string # e.g. GP_Standard_D2ds_v5 or B_Standard_B2s
    storage_mb            = number # e.g. 131072
    backup_retention_days = number # 7-35; PITR window
    high_availability     = bool   # zone-redundant HA (needs General Purpose)
    zone                  = optional(string, "1")
    standby_zone          = optional(string, "2")
    geo_redundant_backup  = optional(bool, false) # needs paired-region access (UAE Central is restricted)
  })
}

variable "redis" {
  description = "Azure Cache for Redis sizing. Basic has no replica (staging only)."
  type = object({
    sku_name = string # Basic or Standard
    capacity = number # C0..C6
  })
}

variable "storage_replication" {
  description = "LRS (staging) or ZRS (production). GRS/GZRS depend on paired-region access."
  type        = string
}

variable "blob_soft_delete_days" {
  description = "Blob and container soft delete retention."
  type        = number
  default     = 30
}

variable "backup_immutability_days" {
  description = "Immutability (WORM) period for the backups container."
  type        = number
  default     = 35
}

# ---------------------------------------------------------------- ops
variable "log_retention_days" {
  description = "Log Analytics retention (30-730)."
  type        = number
}

variable "log_daily_cap_gb" {
  description = "Daily ingestion cap in GB (-1 for none). Staging should be capped."
  type        = number
  default     = -1
}

variable "alert_emails" {
  description = "On-call addresses for alerts and budget notifications. Supplied per environment, never committed."
  type        = list(string)
}

variable "monthly_budget_usd" {
  description = "Monthly budget for the resource group; notifications at 50/80/100 percent of the approved amount."
  type        = number
}

variable "budget_start_date" {
  description = "First day of the budget period, RFC3339 (e.g. 2027-01-01T00:00:00Z)."
  type        = string
}

# ---------------------------------------------------------------- application
variable "app_settings" {
  description = "Non-secret application environment values (see docs/phase-8/environment-variables.md). Secrets are created in Key Vault by this module or supplied out of band."
  type        = map(string)
  default     = {}
}
