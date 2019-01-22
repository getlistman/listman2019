import AWS from 'aws-sdk'
import mongo from './mongo'

const sockets = [] // for offline use only

async function add (user_id, event) {
  
  console.log('websocket-pool add')
  console.log('[EVENT]')
  console.log(event)
  console.log('[ENV]')
  console.log(process.env)
  
  if (event.isOffline) {
    
    // offline
    let obj = {
      user_id: user_id,
      ws: event.ws
    }
    sockets.push(obj)
    return
    
  } else {
    
    // production
    const _id = event.requestContext.connectionId
    const doc = {
      _id: _id,
      user_id: user_id,
      api_id: event.requestContext.apiId,
      region: process.env.AWS_REGION,
      stage: event.requestContext.stage
    }
    
    const db = mongo.getConnection()
    return db.collection('websockets').updateOne({ _id: _id }, { $set: doc }, { upsert: true })
  }
  
}

async function send (user_id, message) {
  
  console.log(user_id + ' => ' + message)
  
  const data = {
    job_id: 0,
    message: message
  }
    
  if (process.env.IS_OFFLINE) {
    
    // offline
    sockets.filter(s => s.user_id == user_id).map(s => {
      if (s.ws.readyState != 1) return
      s.ws.send(JSON.stringify(data))
    })
    
  } else {
    
    // production
    const db = mongo.getConnection()
    const docs = await db.collection('websockets').find({ user_id: user_id }).toArray()
    
    const apiId = docs[0].api_id
    const region = docs[0].region
    const stage = docs[0].stage
    
    let wsClient = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: apiId + '.execute-api.' + region + '.amazonaws.com/' + stage
    })
    
    docs.map(doc => {
      wsClient.postToConnection({
        ConnectionId: doc._id,
        Data: JSON.stringify(data)
      }).promise().catch(err => {
        if (err.statusCode === 410) {
          db.collection('websockets').deleteOne({ _id: doc._id })
        } else {
          console.log('[postToConnection ERROR]')
          console.log(err)
        }
      })
    })
    
  }
}

export { add, send }
