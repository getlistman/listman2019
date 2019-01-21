import Vue from 'vue'
import Router from 'vue-router'
import config from '../config/client'
import { Auth } from 'aws-amplify'

Vue.use(Router)

export function createRouter (store) {
  
  // https://medium.com/@bradfmd/vue-js-setting-up-auth0-6eb26cbbc48a
  async function requireAuth (to, from, next) {
    if (store.state.user) {
      next()
    } else {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    }
  }
  
  async function checkAuth (to, from, next) {
    if (store.state.user) {
      let path = '/' + store.state.lists[0].name + '/' + store.state.lists[0].filters[0].name
      next(path)
    } else {
      next()
    }
  }
  
  let listsRegExp = store.state.lists.map(list => list.name).join('|')
  
  // dynamic child component for list
  let listRoutes = []
  config.lists.map(list => {
    listRoutes.push({
      path: '/:list(' + list.name + ')',
      beforeEnter: requireAuth,
      component: () => import('./components/' + list.name + '/list/Column.vue')
    })
    listRoutes.push({
      path: '/:list(' + list.name + ')/:filter/p:page(\\d+)?',
      beforeEnter: requireAuth,
      component: () => import('./components/' + list.name + '/list/Column.vue')
    })
  })
  
  // dynamic child component for detail tabs
  let tabRoutes = []
  config.lists.map(list => {
    list.tabs.map(tab => {
      let tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
      let route = {
        path: '/:list(' + list.name + ')/:filter/:id/:tab(' + tab + ')',
        beforeEnter: requireAuth,
        component: () => import('./components/' + list.name + '/detail/' + tabName + '.vue')
      }
      tabRoutes.push(route)
    })
  })
  
  // auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        beforeEnter: checkAuth,
        component: () => import('./views/Home.vue')
      },
      {
        path: '/signin',
        beforeEnter: checkAuth,
        component: () => import('./views/SignIn.vue')
      },
      {
        path: '/signup',
        beforeEnter: checkAuth,
        component: () => import('./views/SignUp.vue')
      },
      {
        path: '/settings',
        beforeEnter: requireAuth,
        component: () => import('./views/Settings.vue')
      },
      {
        path: '/:list(' + listsRegExp + ')/:filter',
        beforeEnter: requireAuth,
        component: () => import('./views/Container.vue'),
        children: [
          {
            path: 'p:page(\\d+)?',
            alias: '', // alias for page 1
            beforeEnter: requireAuth,
            // https://router.vuejs.org/guide/essentials/named-views.html
            components: {
              default: () => import('./views/List.vue'),
              filterTree: () => import('./views/FilterTree.vue')
            },
            children: listRoutes
          },
          {
            path: ':id',
            beforeEnter: requireAuth,
            components: {
              default: () => import('./views/Detail.vue'),
              filterTree: () => import('./views/FilterTree.vue')
            },
            children: tabRoutes
          }
        ]
      },
    ]
  })
}
