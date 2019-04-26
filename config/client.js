const lists = require('./list')

const config = {
  
  websocket_url: {
    'localhost': 'ws://localhost:3000/api',
    'listman.d6er.com': 'wss://ws.listman.d6er.com/prod',
    'listdev.d6er.com': 'wss://ws.listdev.d6er.com'
  },
  
  lists: lists
}

module.exports = config
