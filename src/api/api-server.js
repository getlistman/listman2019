import api from '../../src-server/api/index.js'
//import { Auth } from 'aws-amplify'
import Auth from '@aws-amplify/auth'

export default {
  async call (payload) {
    
    const user = await Auth.currentUserInfo()
    payload.user_id = parseInt(user.attributes['custom:user_id']);
    
    return api[payload.action](payload)
  }
}
