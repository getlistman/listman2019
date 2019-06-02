import config from '../config/server'
import * as mongo from './mongo'
import CustomStorage from './CustomStorage'
import cookie from 'cookie'
import * as wsPool from './websocket-pool'
import logger from 'winston'

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

import AWS from 'aws-sdk'
import Amplify, { Auth } from 'aws-amplify'
import aws_exports from '../src/aws-exports'
Amplify.configure(aws_exports)

async function callAPI (event) {
  
  await mongo.connect(config.mongo_url)
  
  if (event.requestContext.eventType == 'CONNECT') {
    
    // CONNECT
    const headerCookie = event.isOffline ? 'cookie' : 'Cookie'
    
    // no cookie when signup
    if (!event.headers.hasOwnProperty(headerCookie)) {
      return
    }
    
    const cookies = cookie.parse(event.headers[headerCookie])
    
    Amplify.configure({ Auth: { storage: new CustomStorage(cookies) } })
    
    // todo: check if auth success
    const userInfo = await Auth.currentUserInfo()
    const user_id = parseInt(userInfo.attributes['custom:user_id'])
    
    return wsPool.add(user_id, event)
    
  } else if (event.requestContext.eventType == 'MESSAGE') {
    
    // MESSAGE
    logger.info(event.body)
    const parsedBody = JSON.parse(event.body)
    const payload = parsedBody.data
    const api = require('./api/index.js')
    const result = await api[payload.action](payload)
    const data = {
      job_id: parsedBody.job_id,
      resolve: result
    }
    
    if (event.isOffline) {
      
      return data
      
    } else {
      
      // production
      const apiId = event.requestContext.apiId
      const region = process.env.AWS_REGION
      const stage = event.requestContext.stage

      let wsClient = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: apiId + '.execute-api.' + region + '.amazonaws.com/' + stage
      })
      
      await wsClient.postToConnection({
        ConnectionId: event.requestContext.connectionId,
        Data: JSON.stringify(data)
      }).promise().catch(err => {
        logger.error(err)
      })
      
      return
    }
  }
  
}

export default callAPI
