variable "slack_config" {
  description = "Slack configuration"
  type = object({
    channel      = string # Slack channel to post messages to
    access_token = string # Access token for the Slack bot
  })
}

variable "event_pattern" {
  description = "EventBridge rule event pattern"
  type        = string
}

variable "input_transformer" {
  description = "EventBridge target input transformer"
  type = object({
    input_paths    = map(any)
    input_template = string
  })
}

variable "sns_topic_to_notify_on_failure" {
  description = "Arn of the sns topic to notify on lambda invocation failure."
  type        = string
  default     = null
}
