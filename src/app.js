import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

// Apollo
//import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

export function createApp () {
  
  // Store and Router
  const store = createStore()
  const router = createRouter(store)
  sync(store, router)
  
  // Apollo
  let apolloProvider = null
  if (typeof window !== 'undefined') {
    const apolloClient = new ApolloClient({
      link: new WebSocketLink({
        //uri: 'ws://localhost:3000/gql',
        uri: 'ws://localhost:3020/subscriptions',
        options: { reconnect: true }
      }),
      cache: new InMemoryCache()
    })
    apolloProvider = new VueApollo({ defaultClient: apolloClient })
  }
  
  // moved from entry-client.js due to initial requireAuth failure at client.
  if (typeof window !== 'undefined') {
    if (window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__)
      store.dispatch('setApiListener')
    }
  }

  const app = new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
  })
  
  return { app, router, store }
}
