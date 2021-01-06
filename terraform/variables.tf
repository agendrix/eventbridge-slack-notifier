variable "lambda_name" {
  description = "Lambda function name"
  type        = string
}

variable "timeout" {
  description = "Lambda timeout"
  type        = number
  default     = 3
}

variable "memory_size" {
  description = "Lambda memory size"
  type        = number
  default     = 128
}

variable "role_arn" {
  description = "Lambda IAM role"
  type        = string
}
