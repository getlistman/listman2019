import config from '../config/server'
import * as mongo from './mongo'
import CustomStorage from './CustomStorage'

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

import Amplify, { Auth } from 'aws-amplify'
import aws_exports from '../src/aws-exports'
Amplify.configure(aws_exports)

let offlineUserID = 0

async function callAPI (cookies, payload) {
  
  Amplify.configure({
    Auth: {
      storage: new CustomStorage(cookies)
    }
  })
  
  console.log('1 userinfo')
  if (process.env.IS_OFFLINE && process.env.OFFLINE_USER_ID) {
    
    console.log('IS_OFFLINE: ' + process.env.IS_OFFLINE)
    console.log('OFFLINE_USER_ID: ' + process.env.OFFLINE_USER_ID)
    payload.user_id = parseInt(process.env.OFFLINE_USER_ID)
    
  } else {
    
    const userInfo = await Auth.currentUserInfo()
    payload.user_id = parseInt(userInfo.attributes['custom:user_id'])
    
    if (process.env.IS_OFFLINE) {
      console.log('set OFFLINE_USER_ID')
      process.env.OFFLINE_USER_ID = payload.user_id
    }
  }
  
  console.log('2 db ' + config.mongo_url)
  const db = await mongo.connect(config.mongo_url)
  
  console.log('3 api call')
  const api = require('./api/index.js')
  
  return api[payload.action](payload)
  
}

export default callAPI
