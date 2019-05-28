import * as mongodb from 'mongodb'

// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient

let db: mongodb.Db

// https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
export function connect(url: string) {
  console.log('mongo.ts connect: ' + url)
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
}
  
export function getConnection() {
  return db
}
  
export async function getNextId(collectionName: string) {
    
  const r = await db.collection('counters').findOneAndUpdate(
    { _id: collectionName },
    { $inc: { seq: 1 } },
    { upsert: true, returnOriginal: false }
  )

  return r.value.seq
}

export default ''
