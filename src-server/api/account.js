const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  addAccount: (user_id, account) => {
    return db.collection('accounts').updateOne(
      {
        user_id: user_id,
        'profile.emailAddress': account.profile.emailAddress
      },
      {
        $set: account
      },
      {
        upsert: true
      }
    )
  },
  
  fetchAccounts: ({ user_id }) => {
    let query = {
      user_id: user_id
    }
    return db.collection('accounts').find(query).toArray()
  },
  
  removeAccount: (user_id, account) => {
    
  }
  
}

module.exports = methods
