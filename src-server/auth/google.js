'use strict'

require = require("esm")(module/*, options*/)

const { google } = require('googleapis');
const config = require('../../config/server')
const util = require('util')
const amplifyAuth = require('./amplify-auth').default
const mongo = require('../mongo')

console.log('[google.js] config')
console.dir(config)

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_CALLBACK_URL
)

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/tasks.readonly'
]

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent select_account',
  //approval_prompt: 'force',
  scope: scopes
})

module.exports.index = (event) => {
  const response = {
    statusCode: 301,
    headers: { Location: url }
  }
  return response
}

module.exports.callback = async (event) => {
  
  const { tokens } = await oauth2Client.getToken(event.queryStringParameters.code)
  
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
  })
  
  const profile = await util.promisify(gmail.users.getProfile)({ userId: 'me' })
    
  const user_id = await amplifyAuth(event)
  
  const db = await mongo.connect(config.mongo_url)
  
  const apiAccount = require('../api/account')
  
  const account = {
    profile: profile.data,
    tokens: tokens
  }
  
  await apiAccount.addAccount(user_id, account)
  
  const response = {
    statusCode: 301,
    headers: { Location: '/settings' }
  }
  
  return response
}
