/*
import axios from 'axios'

export default {
  async call (payload) {
    const result = await axios.post('/api', payload)
    return result.data
  }
}
*/
import WebSocketPromise from './WebSocketPromise'
import config from '../../config/client'

let wsp
let apiListener = null

//connect()

// https://stackoverflow.com/questions/3780511/reconnection-of-client-when-server-reboots-in-websocket
// todo: ping - pong
function connect () {
  
  wsp = new WebSocketPromise(config.websocket_url[window.location.hostname])
  
  wsp.onopen = () => {
    if (apiListener) {
      wsp.setJob(0, apiListener)
    }
  }
  
  wsp.onclose = () => {
    delay(5000).then(() => {
      connect()
    })
  }
}

// https://stackoverflow.com/questions/39538473/using-settimeout-on-promise-chain
function delay (t) {
  return new Promise((resolve, reject) => { 
    setTimeout(resolve, t)
  });
}

function call (data) {
  if (!wsp) {
    connect()
  }
  if (wsp.readyState != 1) {
    return delay(1).then(() => call(data))
  }
  return wsp.send(data) // return a Promise
}

function setJob (job_id, cb) {
  wsp.setJob(job_id, cb)
  apiListener = cb
}

function setApiListener (cb) {
  apiListener = cb
}

export default { connect, call, setJob, setApiListener }
