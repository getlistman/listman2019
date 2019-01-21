const moment = require('moment')
const { google } = require('googleapis')
const gmail = google.gmail({ version: 'v1' })

const config = require('../../config/server')
const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  getOAuth2Client: account => {
    
    // https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating
    let clientId = config.GOOGLE_CLIENT_ID
    let clientSecret = config.GOOGLE_CLIENT_SECRET
    let redirectUrl = "http://localhost:8181/auth/google/callback"
    
    var OAuth2 = google.auth.OAuth2
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
    
    // https://github.com/google/google-api-nodejs-client/#manually-refreshing-access-token
    oauth2Client.setCredentials(account.tokens)
    
    return oauth2Client
  },
  
  // https://developers.google.com/gmail/api/v1/reference/users/messages/list
  messagesList: oauth2Client => {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      maxResults: 100
    }
    return new Promise((resolve, reject) => {
      gmail.users.messages.list(params, function(err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  messagesGet: (oauth2Client, id) => {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      id: id
    }
    return new Promise((resolve, reject) => {
      gmail.users.messages.get(params, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  // https://developers.google.com/gmail/api/v1/reference/users/history/list
  historyList: (oauth2Client, historyId, pageToken) => {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      startHistoryId: historyId
    }
    if (pageToken) {
      params.pageToken = pageToken
    }
    
    return new Promise((resolve, reject) => {
      gmail.users.history.list(params, (err, response) => {
        if (err) {
          console.log('[gmail.js history list ERROR]')
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  getMaxHistoryId: (user_id, list, account) => {
    const coll = list + '.' + user_id
    return db.collection(coll).findOne(
      {
        account: account.profile.emailAddress
      },
      {
        fields: { 'historyId': 1 },
        sort: [ [ 'historyId', 'descending' ] ]
      }
    )
  },
  
  convertMessage: message => {
    
    let headers = message.payload.headers
    message._id = message.id
    message.subject = headers.find(header => header.name == 'Subject').value
    message.from = headers.find(header => header.name == 'From').value.replace(/<[^>]+>/, '')
    
    let to = headers.find(header => header.name == 'To')
    if (to) {
      message.to = headers.find(header => header.name == 'To').value
    }
    
    let date = headers.find(header => header.name == 'Date').value
    message.date = moment(date, "ddd, DD MMM YYYY HH:mm:ss ZZ").toDate()
    
    message.historyId = parseInt(message.historyId)
    
    if (message.payload.parts) {
      message.payload.parts.forEach(part => {
        if (part.mimeType == 'text/html') {
          let decoded = Buffer.from(part.body.data, 'base64').toString('utf8')
          message.html = decoded
        }
      })
    }
    
    message.headerNames = headers.map(header => header.name)
    
    return message
  },
  
  syncItems: (user_id, account) => {
    let oauth2Client = methods.getOAuth2Client(account)
    return methods.getMaxHistoryId(user_id, 'emails', account).then(r => {
      console.log('syncItems: ' + account.profile.emailAddress + ' ' + r.historyId)
      return methods.syncItems2(user_id, account, oauth2Client, r.historyId)
    }).catch(e => {
      //console.dir(e)
      return methods.fullSyncItems(user_id, account, oauth2Client)
    }).catch(e => {
      console.dir(e)
    })
  },
  
  syncItems2: (user_id, account, oauth2Client, historyId, pageToken) => {
    
    return methods.historyList(oauth2Client, historyId, pageToken).then(r => {
      if (!r.data.hasOwnProperty('history')) return
      
      return Promise.all(r.data.history.map(historyItem => {
        return methods.processHistory(user_id, account, oauth2Client, historyItem)
      })).then(processResult => {
        if (!r.data.hasOwnProperty('nextPageToken')) return
        return methods.syncItems2(user_id, account, oauth2Client, historyId, r.data.nextPageToken)
      })
    })
  },
  
  fullSyncItems: (user_id, account, oauth2Client) => {
    
    console.log('fullSyncItems: ' + account.profile.emailAddress)
    
    return methods.messagesList(oauth2Client).then(r => {
      
      let message_ids = []
      r.data.messages.map(message => {
        message_ids.push(message.id)
      })
      return message_ids
    }).then(message_ids => {
      
      if (message_ids.length == 0) return
          
      return Promise.all(message_ids.map((message_id, idx) => {
        
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            
            let count = '(' + idx + '/' + message_ids.length + ')'
            
            return methods.messagesGet(oauth2Client, message_id).then(responseMessage => {
              
              let converted = methods.convertMessage(responseMessage.data)
              converted.account = account.profile.emailAddress
              
              let coll = db.collection('emails.' + user_id)
              return coll.updateOne({ _id: converted._id },
                                    { $set: converted},
                                    { upsert: true })
              
            }).then(r => {
              resolve()
            }).catch(e => {
              console.dir(e)
              resolve()
            })
          }, idx * 200)
        })
      }))
      
    }).catch(e => {
      //console.log(e)
      console.log('fullSyncItems: ERROR ' + account.profile.emailAddress)
    })
  },
  
  processHistory: (user_id, account, oauth2Client, historyItem) => {
    
    let coll = db.collection('emails.' + user_id)
    
    if (historyItem.hasOwnProperty('messagesAdded')) {
      
      return Promise.all(historyItem.messagesAdded.map(m => {
        return methods.messagesGet(oauth2Client, m.message.id).then(responseMessage => {
          
          let converted = methods.convertMessage(responseMessage.data)
          converted.account = account.profile.emailAddress
          
          return coll.updateOne({ _id: converted._id },
                                { $set: converted },
                                { upsert: true })
        })
      }))
      
    } else if (historyItem.hasOwnProperty('messagesDeleted')) {
      
      return Promise.all(historyItem.messagesDeleted.map(m => {
        return coll.deleteOne({ _id: m.message.id })
      }))
      
    } else if (historyItem.hasOwnProperty('labelsAdded')) {
      
      return Promise.all(historyItem.labelsAdded.map(m => {
        return coll.updateOne({ _id: m.message.id },
                              { $set: { labelIds: m.message.labelIds } })
      }))
      
    } else if (historyItem.hasOwnProperty('labelsRemoved')) {
      
      return Promise.all(historyItem.labelsRemoved.map(m => {
        return coll.updateOne({ _id: m.message.id },
                              { $set: { labelIds: m.message.labelIds } })
      }))
      
    }
    
    return
  }
  
}

module.exports = methods
