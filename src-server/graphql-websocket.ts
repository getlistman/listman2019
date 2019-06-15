import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

async function callAPI (event: any = {}) {
  
  console.log('[graphql-websocket]')
  const parsedBody = JSON.parse(event.body)
  console.dir(parsedBody)
  
  if (event.isOffline && parsedBody) {
    if (parsedBody.type == 'connection_init') {
      return {
        type: "connection_ack"
      }
    }
    if (parsedBody && parsedBody.type == 'start') {
      return {
        id: parsedBody.id,
        type: "data",
        payload: {
          hello: "fooo1234"
        }
      }
    }
  }
  
  return ""
  
  // https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md
  const subscriptionServer = SubscriptionServer.create(
    {
      execute,
      subscribe,
      onConnect: (connectionParams: Object,
                  webSocket: WebSocket,
                  context: ConnectionContext) => {
        console.log("## onConnect");
      }
    },
    {
      noServer: true
    }
  )
}

export default callAPI
