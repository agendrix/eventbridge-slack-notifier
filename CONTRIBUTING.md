# Contributing

## Testing

```bash
yarn install
yarn test
```

## Publish a new release

- Bump [`package.json`](./package.json) version (ie.: 1.0.0)
- Create a new release (ie.: v1.0.0)
- A GitHub workflow will automatically run, build and upload the new code to AWS Lambda.

## Note about `aws-sdk`

`aws-sdk` is placed as a devDependency in the projet in order to build smaller zip file for the distribution.

From the [Building Lambda functions with Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html) documentation:

> Your code runs in an environment that includes the AWS SDK for JavaScript, with credentials from an AWS Identity and Access Management (IAM) role that you manage.
