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
  
  // Logging
  console.log('[handler.js] event.isOffline: ' + event.isOffline)
  if (coldStart) {
    console.log('[handler.js] COLD START path: ' + event.path)
  }
  if (event.hasOwnProperty('requestContext')) {
    console.log('[handler.js] eventType: ' + event.requestContext.eventType)
  }
  
  context.callbackWaitsForEmptyEventLoop = false
  coldStart = false
  
  // WebSocket
  if (event.hasOwnProperty('requestContext')) {
    if (event.requestContext.eventType == 'CONNECT') {
      await websocket(event)
      return { statusCode: 200 }
    } else if (event.requestContext.eventType == 'MESSAGE') {
      const wsResult = await websocket(event)
      if (event.isOffline) {
        console.log('[handler.js wsResult]')
        console.log(wsResult)
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
  } else {
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
