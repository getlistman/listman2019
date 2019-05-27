'use strict'

require = require("esm")(module/*, options*/)

const { google } = require('googleapis');
const config = require('../../config/server').default
const util = require('util')
const amplifyAuth = require('./amplify-auth').default
const mongo = require('../mongo')

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
  
  console.log('google.js callback')
  
  const { tokens } = await oauth2Client.getToken(event.queryStringParameters.code)
  
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
  })
  
  console.log('google.js profile')
  /*
  gmail.users.getProfile({
    auth: oauth2Client,
    userId: 'me'
  }, function(err, res) {
    console.dir(err);
    console.dir(res);
  });
  */
  const profile = await util.promisify(gmail.users.getProfile)({ auth: oauth2Client, userId: 'me' })
    
  console.log('google.js user_id')
  const user_id = await amplifyAuth(event)
  
  console.log('google.js db')
  const db = await mongo.connect(config.mongo_url)
  
  console.log('google.js account')
  const apiAccount = require('../api/account')
  
  const account = {
    profile: profile.data,
    tokens: tokens
  }
  
  console.log('google.js addAccount')
  await apiAccount.addAccount(user_id, account)
  
  const response = {
    statusCode: 301,
    headers: { Location: '/settings' }
  }
  
  return response
}
