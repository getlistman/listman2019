'use strict'

const require_esm = require("esm")(module)

const mongo = require('./mongo')
const util = require('util')
const ssr = require('./ssr')
const api = require_esm('./api').default
const websocket = require_esm('./websocket').default
const cookie = require('cookie')
const google = require('./auth/google')

let coldStart = true

module.exports.index = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false

  console.log('[handler.js] coldStart: ' + coldStart + ' ' + event.source)
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
    
    if (true) {
      //console.log('[handler.js] event')
      console.dir(event)
    }
    
    const cookies = event.hasOwnProperty('headers') && event.headers.hasOwnProperty('Cookie')
          ? cookie.parse(event.headers.Cookie) : ''
    const ssrBody = await util.promisify(ssr)(event, cookies)
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: ssrBody
    }
  }
}
