import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

import AWS from 'aws-sdk'

async function callAPI (event: any = {}) {
  
  const subscriptionServer = SubscriptionServer.create(
    { execute, subscribe },
    { noServer: true }
  )
  
  const res = subscriptionServer.onMessage({
    socket: {
      readyState: 1,
      send: message => {

        console.log('send: ' + message);
        
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
      },
    },
    
    initPromise: Promise.resolve(true)
  });
  
  return res(event.body)
}

export default callAPI
