import { mount, shallowMount, createLocalVue } from '@vue/test-utils'

import VueRouter from 'vue-router'
import { createRouter } from './src/router'
import Vuex from 'vuex'

import App from './src/App.vue'
import Home from './src/views/Home.vue'
import NavbarGuest from './src/views/NavbarGuest.vue'

const localVue = createLocalVue() 

localVue.use(VueRouter)
localVue.use(Vuex)

describe('App', () => {
  
  let store = new Vuex.Store({})
  let router = createRouter(store)
  
  const wrapper = mount(App, { store, router, localVue })
  
  console.log(wrapper.html())
  
  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('contains Home', () => {
    expect(wrapper.contains(Home)).toBe(true)
  })

  test('contains NavbarGuest', () => {
    expect(wrapper.contains(NavbarGuest)).toBe(true)
  })
})

describe('Home', () => {
  
  const wrapper = mount(Home)
  
  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  
  test('contains .container', () => {
    expect(wrapper.contains('.container')).toBe(true)
  })
})
