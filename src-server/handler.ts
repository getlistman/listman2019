import { Handler, Context } from 'aws-lambda'

const require_esm = require("esm")(module)

const mongo = require('./mongo')
const util = require('util')
import ssr from './ssr'
const api = require_esm('./api').default
const websocket = require_esm('./websocket').default
const cookie = require('cookie')
const google = require('./auth/google')

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e01d6e7abb2343c6b845d4945a368ed55cbf5bd2/types/aws-lambda/index.d.ts#L482
interface Response {
  statusCode: number
  headers?: {
    [header: string]: boolean | number | string
  }
  body: string
}

let coldStart: boolean = true

export const index: Handler = async (event: any = {}, context: Context): Promise<any> => {
  
  context.callbackWaitsForEmptyEventLoop = false
  
  console.log('[handler.js] coldStart: ' + coldStart + ' ' + event.path)
  coldStart = false

  // CloudWatch event (ping)
  if (event.source == 'aws.events') {
    console.log('aws ping return');
    return { statusCode: 200 }
  }

  // Logging
  /*
  console.log('[handler.js] event')
  console.dir(event)
  console.log('[handler.js] context')
  console.dir(context)
  */
  
  // WebSocket
  if (event.hasOwnProperty('requestContext')) {
    if (event.requestContext.eventType == 'CONNECT') {
      await websocket(event)
      return { statusCode: 200 }
    } else if (event.requestContext.eventType == 'DISCONNECT') {
      return { statusCode: 200 }
    } else if (event.requestContext.eventType == 'MESSAGE') {
      const wsResult = await websocket(event)
      if (event.isOffline) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/html" },
          body: JSON.stringify(wsResult)
        }
      } else {
        return { statusCode: 200 }
      }
    }
  }
  
  // HTTP
  if (event.path == '/auth/google') {

    return google.index()

  } else if (event.path == '/auth/google/callback') {

    return google.callback(event)

  } else {

    const cookies: string = event.hasOwnProperty('headers') && event.headers.hasOwnProperty('Cookie')
          ? cookie.parse(event.headers.Cookie) : ''
    
    const ssrBody: string = await ssr(event, cookies)
    
    const response: Response = {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: ssrBody
    }
    
    return response
  }
}
