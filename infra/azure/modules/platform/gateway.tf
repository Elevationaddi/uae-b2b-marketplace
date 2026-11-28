# Production edge: Application Gateway WAF v2 in UAE North. TLS terminates in-region (A14), then
# traffic goes to the internal Container Apps environment over the VNet.

locals {
  gw          = var.enable_app_gateway
  gw_name     = "agw-${local.base}"
  web_backend = "web-backend"
  hosts = {
    web   = var.public_hostnames.web
    admin = var.public_hostnames.admin
  }
}

# The internal environment's default domain must resolve inside the VNet to its static IP.
resource "azurerm_private_dns_zone" "environment" {
  count               = local.gw ? 1 : 0
  name                = azurerm_container_app_environment.this.default_domain
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags
}

resource "azurerm_private_dns_a_record" "environment_wildcard" {
  count               = local.gw ? 1 : 0
  name                = "*"
  zone_name           = azurerm_private_dns_zone.environment[0].name
  resource_group_name = azurerm_resource_group.this.name
  ttl                 = 300
  records             = [azurerm_container_app_environment.this.static_ip_address]
}

resource "azurerm_private_dns_zone_virtual_network_link" "environment" {
  count                 = local.gw ? 1 : 0
  name                  = "link-environment"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.environment[0].name
  virtual_network_id    = azurerm_virtual_network.this.id
}

resource "azurerm_public_ip" "gateway" {
  count               = local.gw ? 1 : 0
  name                = "pip-${local.base}-gateway"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  allocation_method   = "Static"
  sku                 = "Standard"
  zones               = ["1", "2", "3"]
  tags                = local.tags
}

resource "azurerm_web_application_firewall_policy" "this" {
  count               = local.gw ? 1 : 0
  name                = "waf-${local.base}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name

  policy_settings {
    enabled                     = true
    mode                        = "Prevention"
    request_body_check          = true
    max_request_body_size_in_kb = 128
    file_upload_limit_in_mb     = 15 # uploads are capped at 10 MB by the API (UPLOAD_MAX_BYTES)
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
    managed_rule_set {
      type    = "Microsoft_BotManagerRuleSet"
      version = "1.0"
    }
  }

  # Coarse per-IP limit in front of the application's own Redis rate limits.
  custom_rules {
    name                 = "ratelimitperip"
    priority             = 10
    rule_type            = "RateLimitRule"
    rate_limit_duration  = "OneMin"
    rate_limit_threshold = 600
    group_rate_limit_by  = "ClientAddr"
    action               = "Block"
    match_conditions {
      match_variables {
        variable_name = "RemoteAddr"
      }
      operator           = "IPMatch"
      negation_condition = true
      match_values       = ["255.255.255.255/32"]
    }
  }

  tags = local.tags
}

resource "azurerm_application_gateway" "this" {
  count               = local.gw ? 1 : 0
  name                = local.gw_name
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  zones               = ["1", "2", "3"]
  firewall_policy_id  = azurerm_web_application_firewall_policy.this[0].id
  enable_http2        = true
  tags                = local.tags

  sku {
    name = "WAF_v2"
    tier = "WAF_v2"
  }

  autoscale_configuration {
    min_capacity = 1
    max_capacity = 4
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.apps.id]
  }

  gateway_ip_configuration {
    name      = "gateway-ip"
    subnet_id = azurerm_subnet.gateway[0].id
  }

  frontend_port {
    name = "https"
    port = 443
  }

  frontend_port {
    name = "http"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "public"
    public_ip_address_id = azurerm_public_ip.gateway[0].id
  }

  ssl_policy {
    policy_type = "Predefined"
    policy_name = "AppGwSslPolicy20220101S" # TLS 1.2+ with strong ciphers
  }

  ssl_certificate {
    name                = "public-hosts"
    key_vault_secret_id = var.tls_certificate_secret_id
  }

  backend_address_pool {
    name  = local.web_backend
    fqdns = [azurerm_container_app.app["web"].ingress[0].fqdn]
  }

  probe {
    name                = "web"
    protocol            = "Https"
    path                = "/en"
    interval            = 30
    timeout             = 10
    unhealthy_threshold = 3
    host                = var.public_hostnames.web
    match {
      status_code = ["200-399"]
    }
  }

  # The web app must see the public Host header (it decides between the buyer site and the admin
  # portal, A03): no host override, so the original Host and SNI reach the custom domain binding.
  backend_http_settings {
    name                                = "web"
    protocol                            = "Https"
    port                                = 443
    cookie_based_affinity               = "Disabled"
    request_timeout                     = 60
    pick_host_name_from_backend_address = false
    probe_name                          = "web"
  }

  dynamic "http_listener" {
    for_each = local.hosts
    content {
      name                           = "https-${http_listener.key}"
      frontend_ip_configuration_name = "public"
      frontend_port_name             = "https"
      protocol                       = "Https"
      host_name                      = http_listener.value
      ssl_certificate_name           = "public-hosts"
      require_sni                    = true
    }
  }

  dynamic "http_listener" {
    for_each = local.hosts
    content {
      name                           = "http-${http_listener.key}"
      frontend_ip_configuration_name = "public"
      frontend_port_name             = "http"
      protocol                       = "Http"
      host_name                      = http_listener.value
    }
  }

  dynamic "redirect_configuration" {
    for_each = local.hosts
    content {
      name                 = "to-https-${redirect_configuration.key}"
      redirect_type        = "Permanent"
      target_listener_name = "https-${redirect_configuration.key}"
      include_path         = true
      include_query_string = true
    }
  }

  dynamic "request_routing_rule" {
    for_each = { for i, k in keys(local.hosts) : k => i }
    content {
      name                       = "https-${request_routing_rule.key}"
      rule_type                  = "Basic"
      priority                   = 100 + request_routing_rule.value
      http_listener_name         = "https-${request_routing_rule.key}"
      backend_address_pool_name  = local.web_backend
      backend_http_settings_name = "web"
    }
  }

  dynamic "request_routing_rule" {
    for_each = { for i, k in keys(local.hosts) : k => i }
    content {
      name                        = "http-${request_routing_rule.key}"
      rule_type                   = "Basic"
      priority                    = 200 + request_routing_rule.value
      http_listener_name          = "http-${request_routing_rule.key}"
      redirect_configuration_name = "to-https-${request_routing_rule.key}"
    }
  }

  lifecycle {
    precondition {
      condition     = var.public_hostnames.web != var.public_hostnames.admin
      error_message = "The admin host must differ from the web host (A03)."
    }
  }

  depends_on = [
    azurerm_private_dns_zone_virtual_network_link.environment,
    azurerm_container_app_custom_domain.web,
    azurerm_role_assignment.certificates_reader,
  ]
}
