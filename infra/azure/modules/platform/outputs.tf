output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "gateway_public_ip" {
  description = "Point the public DNS records (www, admin) here in production."
  value       = var.enable_app_gateway ? azurerm_public_ip.gateway[0].ip_address : null
}

output "web_fqdn" {
  description = "Staging: CNAME target for the public host names (ingress is IP-restricted)."
  value       = azurerm_container_app.app["web"].ingress[0].fqdn
}

output "environment_verification_id" {
  description = "TXT value (asuid) for Container Apps custom domain verification."
  value       = azurerm_container_app_environment.this.custom_domain_verification_id
}

output "container_registry_login_server" {
  value = local.registry_login_server
}

output "container_registry_id" {
  value = local.registry_id
}

output "key_vault_uri" {
  value = azurerm_key_vault.this.vault_uri
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.this.fqdn
}

output "apps_identity_client_id" {
  value = azurerm_user_assigned_identity.apps.client_id
}
