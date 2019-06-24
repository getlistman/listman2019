import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

import AWS from 'aws-sdk'

import EventEmitter from 'events'

async function callAPI (event: any = {}) {
  
  const dummyServer = new EventEmitter()
  
  eventEmitter.on('message', message => {
    console.log('emit: ' + message);
  })
  
  const subscriptionServer = SubscriptionServer.create(
    { execute, subscribe },
    { dummyServer }
  )
  
  console.log("[subscriptionServer]")
  console.dir(subscriptionServer)
  
  /*
  const res = subscriptionServer.onMessage({
    socket: {
      readyState: 1,
      send: (message) => {

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
  */
  
  //return res(event.body)
}

export default callAPI
