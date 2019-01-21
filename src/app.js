import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

export function createApp () {
  
  const store = createStore()
  const router = createRouter(store)
  
  sync(store, router)
  
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
    render: h => h(App)
  })
  
  return { app, router, store }
}
