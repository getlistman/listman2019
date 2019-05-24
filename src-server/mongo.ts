import * as mongodb from 'mongodb'

// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient

let db: mongodb.Db

const actions = {
  
  // https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
  connect: (url: string) => {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
          return MongoClient.connect(url, { useNewUrlParser: true }).then((client: mongodb.MongoClient) => {
              let dbName: string = process.env.IS_OFFLINE
                  ? 'listman' : process.env.STAGE
                  ? process.env.STAGE : ''
              db = client.db(dbName)
              resolve(db)
        })
      }
    })
  },
  
  getConnection: () => {
    return db
  },
  
  getNextId: async (collectionName: string) => {
    
    const r = await db.collection('counters').findOneAndUpdate(
      { _id: collectionName },
      { $inc: { seq: 1 } },
      { upsert: true, returnOriginal: false }
    )
    
    return r.value.seq
  }
}

module.exports = actions
