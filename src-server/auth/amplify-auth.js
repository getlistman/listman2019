import cookie from 'cookie'
import CustomStorage from '../CustomStorage'

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

import Amplify, { Auth } from 'aws-amplify'
import aws_exports from '../../src/aws-exports'
Amplify.configure(aws_exports)

async function getUserID (event) {
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  
  Amplify.configure({
    Auth: {
      storage: new CustomStorage(cookies)
    }
  })
  
  const userInfo = await Auth.currentUserInfo()
  const user_id = parseInt(userInfo.attributes['custom:user_id'])
  
  return user_id
}

export default getUserID
