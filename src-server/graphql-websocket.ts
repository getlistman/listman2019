import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import schema from './graphql-schema';
import AWS from 'aws-sdk'
import EventEmitter from 'events'

async function callAPI (event: any = {}) {
  
  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { noServer: true }
  )
  
  const wss = subscriptionServer.server
  const ws = new DummySocket(event)
  
  wss.emit("connection", ws, event.body)
  ws.emit("message", event.body)
}

export default callAPI

class DummySocket extends EventEmitter {
  
  event: any
  
  constructor(event: any) {
    super()
    this.event = event
  }
  
  async send(data: any) {
    
    const event = this.event
    
    console.log('[this.send] ' + data)
    if (event.isOffline) {
      
      return
      
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
        //logger.error(err)
      })
      
      return
    }
  }
}
