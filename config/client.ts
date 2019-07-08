import { default as lists } from './list'

export default {
  
  websocket_url: {
    'localhost': 'ws://localhost:3000/api',
    'listman.y15e.io': 'wss://listman-ws.y15e.io',
    'listdev.y15e.io': 'wss://listdev-ws.y15e.io'
  },
  
  graphql_url: {
    'localhost': 'http://localhost:8080/query',
    'listman.y15e.io': 'wss://listman-ws.y15e.io',
    'listdev.y15e.io': 'wss://listdev-ws.y15e.io'
  },

  lists: lists
}
