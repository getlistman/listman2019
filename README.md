# vue-ssr-serverless

Vue SSR Serverless Example

**Usage**

```
$ git clone git@github.com:d6er/vue-ssr-serverless.git
$ cd vue-ssr-serverless/
$ npm install vue vue-server-renderer
$ serverless deploy
```

handler.js is based on https://ssr.vuejs.org/guide/#rendering-a-vue-instance

**Offline Development**
```
$ serverless offline start
```
Open http://localhost:3000/hello in browser.

# notes

## AWS Services
- CloudFormation
- API Gateway
- Lambda
- Cognito
- Route53
- S3
- CloudWatch
- CloudFront(?)
- IAM
- Certificate Manager

[Other]
- MongoDB
- GoDaddy

## Initialization

1. Create a hosted zone
2. Create certificate via ACM
3. serverless create_domain
4. amplify init
5. amplify add auth
6. amplify push
7. Create "user_id" attribute in Cognito user pool
8. npm run deploy:prod
9. Add CNAME record for HTTP and websocket
10. Create a custom domain for websocket

## Delete application

1. amplify delete
2. serverless remove --stage prod
