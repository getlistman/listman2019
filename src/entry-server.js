import config from '../config/server'
import * as mongo from '../src-server/mongo'
import CustomStorage from '../src-server/CustomStorage'
//import { createApp } from './app' // note: moved to inside Promise

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

/* Amplify */
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from './aws-exports'
//Amplify.configure(aws_exports)

export default context => {
  
  let newStorage = new CustomStorage(context.cookies)
  awsmobile.Auth = { storage: newStorage }
  Amplify.configure(awsmobile)

  return new Promise((resolve, reject) => {
    
    return mongo.connect(config.mongo_url).then(db => {
      
      // note: import app.js after mongo connection
      //const { app, router, store } = createApp()
      const { app, router, store } = require('./app').createApp()
      
      return new Promise((resolve, reject) => {

        Auth.currentUserInfo().then(user => {
          
          store.state.user = user // todo: remove user attributes from store
          
          // fetch filter data and set to store (for redirect from / path)
          let query = {
            user_id: parseInt(user.attributes['custom:user_id'])
          }
          // todo: exclude user_id from result
          db.collection('filters').find(query).toArray().then(filters => {
            store.state.lists.forEach(list => {
              list.filters = filters.filter(f => f.list == list.name)
            })
            return
          }).then(() => {
            db.collection('accounts').find(query).toArray().then(accounts => {
              store.state.accounts = accounts
            })
            resolve()
          })
          
        }).catch(e => {
          resolve()
        })
  

      }).then(() => {
        
        if (!context.url) {
          console.log('[entry-server.js] context');
          console.dir(context);
        }
        router.push(context.url)
        
        router.onReady(() => {
          
          const matchedComponents = router.getMatchedComponents()
          if (!matchedComponents.length) {
            reject({ code: 404 })
          }
          
          Promise.all(matchedComponents.map(Component => {
            if (Component.asyncData) {
              return Component.asyncData({ store, route: router.currentRoute })
            }
          })).then(() => {
            context.state = store.state
            resolve(app)
          }).catch(e => {
            console.log('async error')
            console.log(e)
          })
                      
          
        }, reject)
        
      })
      
    })
  })
}
