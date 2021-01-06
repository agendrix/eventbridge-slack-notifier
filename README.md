# Terraform AWS Lambda

_Template repository for creating a TypeScript AWS lambda function with Terraform_

![Release](https://github.com/agendrix/terraform-aws-lambda/workflows/Release/badge.svg) ![Tests](https://github.com/agendrix/terraform-aws-lambda/workflows/Tests/badge.svg?branch=main)

## How to use with Terraform

Add the module to your [Terraform](https://www.terraform.io/) project:

```terraform
module "terraform_aws_lambda" {
  source      = "git@github.com:agendrix/terraform-aws-lambda.git//terraform?ref=v0.2.0"
  lambda_name = "my-typescript-lambda"
  role_arn    = aws_iam_role.iam_for_lambda.role_arn
}
```

See [Resource: aws_lambda_function](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) for more information about the required `aws_iam_role`.

In order to be able to receive http requests to the lambda, you will need to hook it up with an AWS API Gateway.
You can do so by following this guide: [Serverless Applications with AWS Lambda and API Gateway](https://learn.hashicorp.com/tutorials/terraform/lambda-api-gateway).

After applying the terraform plan, a dummy lambda will be available in the [AWS Lambda Console](https://console.aws.amazon.com/lambda/).

## Deploying a new version of the lambda

- Make sure you have all the required [GitHub Actions secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) for [`.github/workflows/release.yml`](.github/workflows/release.yml) to work.
- Follow [CONTRIBUTING.md / Publish a new release](./CONTRIBUTING.md#publish-a-new-release) for deploying a new release.

---

Your AWS lambda should now be available at https://console.aws.amazon.com/lambda/.

Logs from the lambda will be available in AWS CloudWatch `/aws/lambda/${yourLambdaName}` log group.
