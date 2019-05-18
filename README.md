# listman

An example list management application

## Technologies

* Vue.js
* Node.js
* Express.js
* MongoDB

## AWS Services

* CloudFormation
* API Gateway
* Lambda
  - handler.js is based on https://ssr.vuejs.org/guide/#rendering-a-vue-instance
* Cognito
* Route53
  - "y15e.io" domain
* S3
* CloudWatch
* CloudFront
  - configured by API Gateway custom domain setting
* IAM
* Certificate Manager

## Initialization

1. Create a hosted zone
2. Create certificate via ACM
3. serverless create_domain (remove Godaddy entry before)
4. amplify init
5. amplify add auth (use customize flow)
6. amplify push
7. Create "user_id" attribute in Cognito user pool
8. npm run deploy:prod
9. Add CNAME record for HTTP and websocket
10. Create a custom domain for websocket

## Delete application

1. amplify delete
2. serverless remove --stage prod

## Add a new amplify environment

1. git checkout dev
2. amplify env add
   Ref: https://github.com/aws-amplify/amplify-cli/issues/1001
   
