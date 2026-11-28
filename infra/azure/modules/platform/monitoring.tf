resource "azurerm_log_analytics_workspace" "this" {
  name                = "log-${local.base}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days
  daily_quota_gb      = var.log_daily_cap_gb
  tags                = local.tags
}

resource "azurerm_application_insights" "this" {
  name                = "appi-${local.base}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  workspace_id        = azurerm_log_analytics_workspace.this.id
  application_type    = "Node.JS"
  tags                = local.tags
}

resource "azurerm_monitor_action_group" "oncall" {
  name                = "ag-${local.base}-oncall"
  resource_group_name = azurerm_resource_group.this.name
  short_name          = "oncall${local.env_short}"

  dynamic "email_receiver" {
    for_each = var.alert_emails
    content {
      name                    = "email-${email_receiver.key}"
      email_address           = email_receiver.value
      use_common_alert_schema = true
    }
  }

  tags = local.tags
}

# ---------------------------------------------------------------- diagnostics
locals {
  diagnostic_targets = merge(
    {
      postgres = azurerm_postgresql_flexible_server.this.id
      keyvault = azurerm_key_vault.this.id
      redis    = azurerm_redis_cache.this.id
      blob     = "${azurerm_storage_account.this.id}/blobServices/default"
    },
    local.gw ? { gateway = azurerm_application_gateway.this[0].id } : {},
  )
}

resource "azurerm_monitor_diagnostic_setting" "this" {
  for_each                   = local.diagnostic_targets
  name                       = "to-log-analytics"
  target_resource_id         = each.value
  log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id

  enabled_log {
    category_group = "allLogs"
  }

  metric {
    category = "AllMetrics"
  }
}

# ---------------------------------------------------------------- alerts
locals {
  metric_alerts = merge(
    {
      postgres-cpu = {
        scope  = azurerm_postgresql_flexible_server.this.id, namespace = "Microsoft.DBforPostgreSQL/flexibleServers"
        metric = "cpu_percent", aggregation = "Average", operator = "GreaterThan", threshold = 80, severity = 2
      }
      postgres-storage = {
        scope  = azurerm_postgresql_flexible_server.this.id, namespace = "Microsoft.DBforPostgreSQL/flexibleServers"
        metric = "storage_percent", aggregation = "Average", operator = "GreaterThan", threshold = 80, severity = 1
      }
      redis-memory = {
        scope  = azurerm_redis_cache.this.id, namespace = "Microsoft.Cache/redis"
        metric = "usedmemorypercentage", aggregation = "Maximum", operator = "GreaterThan", threshold = 80, severity = 1
      }
      api-restarts = {
        scope  = azurerm_container_app.app["api"].id, namespace = "Microsoft.App/containerApps"
        metric = "RestartCount", aggregation = "Total", operator = "GreaterThan", threshold = 3, severity = 2
      }
      worker-restarts = {
        scope  = azurerm_container_app.app["worker"].id, namespace = "Microsoft.App/containerApps"
        metric = "RestartCount", aggregation = "Total", operator = "GreaterThan", threshold = 3, severity = 2
      }
    },
    local.gw ? {
      gateway-unhealthy = {
        scope  = azurerm_application_gateway.this[0].id, namespace = "Microsoft.Network/applicationGateways"
        metric = "UnhealthyHostCount", aggregation = "Average", operator = "GreaterThan", threshold = 0, severity = 1
      }
      gateway-5xx = {
        scope  = azurerm_application_gateway.this[0].id, namespace = "Microsoft.Network/applicationGateways"
        metric = "ResponseStatus", aggregation = "Total", operator = "GreaterThan", threshold = 50, severity = 2
      }
    } : {},
  )
}

resource "azurerm_monitor_metric_alert" "this" {
  for_each            = local.metric_alerts
  name                = "alert-${local.base}-${each.key}"
  resource_group_name = azurerm_resource_group.this.name
  scopes              = [each.value.scope]
  severity            = each.value.severity
  frequency           = "PT5M"
  window_size         = "PT15M"

  criteria {
    metric_namespace = each.value.namespace
    metric_name      = each.value.metric
    aggregation      = each.value.aggregation
    operator         = each.value.operator
    threshold        = each.value.threshold

    dynamic "dimension" {
      for_each = each.key == "gateway-5xx" ? [1] : []
      content {
        name     = "HttpStatusGroup"
        operator = "Include"
        values   = ["5xx"]
      }
    }
  }

  action {
    action_group_id = azurerm_monitor_action_group.oncall.id
  }

  tags = local.tags
}

# Failed backup or migration job runs (log-based).
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "job_failures" {
  name                 = "alert-${local.base}-job-failures"
  location             = azurerm_resource_group.this.location
  resource_group_name  = azurerm_resource_group.this.name
  scopes               = [azurerm_log_analytics_workspace.this.id]
  severity             = 1
  evaluation_frequency = "PT15M"
  window_duration      = "PT1H"

  criteria {
    query = <<-KQL
      ContainerAppSystemLogs_CL
      | where JobName_s in ("job-backup", "job-migrate")
      | where Reason_s in ("BackOff", "Failed", "ReplicaFailed")
    KQL
    time_aggregation_method = "Count"
    operator                = "GreaterThan"
    threshold               = 0
  }

  action {
    action_groups = [azurerm_monitor_action_group.oncall.id]
  }

  tags = local.tags
}

# ---------------------------------------------------------------- budget
resource "azurerm_consumption_budget_resource_group" "this" {
  name              = "budget-${local.base}"
  resource_group_id = azurerm_resource_group.this.id
  amount            = var.monthly_budget_usd
  time_grain        = "Monthly"

  time_period {
    start_date = var.budget_start_date
  }

  dynamic "notification" {
    for_each = { actual50 = 50, actual80 = 80, actual100 = 100 }
    content {
      enabled        = true
      threshold      = notification.value
      operator       = "GreaterThanOrEqualTo"
      threshold_type = "Actual"
      contact_emails = var.alert_emails
    }
  }

  notification {
    enabled        = true
    threshold      = 100
    operator       = "GreaterThanOrEqualTo"
    threshold_type = "Forecasted"
    contact_emails = var.alert_emails
  }
}
