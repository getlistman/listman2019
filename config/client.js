const lists = require('./list')

const config = {
  
  websocket_url: {
    'localhost': 'ws://localhost:3000/api',
    'sls.d6er.com': 'wss://ws.d6er.com/dev'
  },
  
  lists: lists
}

module.exports = config
