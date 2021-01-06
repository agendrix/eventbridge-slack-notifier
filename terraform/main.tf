data "archive_file" "dummy" {
  type        = "zip"
  output_path = "${path.module}/.terraform/dummy_lambda.zip"

  source {
    content  = "hello"
    filename = "dummy.txt"
  }
}

resource "aws_lambda_function" "lambda" {
  filename      = data.archive_file.dummy.output_path
  function_name = var.lambda_name
  role          = var.role_arn
  handler       = "index.handler"

  timeout     = var.timeout
  memory_size = var.memory_size

  runtime = "nodejs12.x"
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 14
}
