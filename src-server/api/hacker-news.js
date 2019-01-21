const axios = require('axios')

//const wsPool = require('../websocket-pool')

const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  syncTopStories: (user_id) => {
    
    //wsPool.send(user_id, 'Syncing hacker news top stories.')
    
    let url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
    
    return axios.get(url).then(r => {
      return Promise.all(
        r.data.map((id, idx) => {
          let url = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json'
          return axios.get(url).then(res => {
            
            let item = res.data
            item._id = item.id
            item.idx = idx
            //wsPool.send(user_id, idx + ' - ' + item.title)
            
            return db.collection('hacker-news.' + user_id).updateOne({ _id: item._id },
                                                                     { $set: item},
                                                                     { upsert: true })
          })
        })
      )
    })
  }
  
}

module.exports = methods
