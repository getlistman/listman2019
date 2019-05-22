import { Handler, Context } from 'aws-lambda'

const ssr = require('./ssr')
const cookie = require('cookie')
const util = require('util')

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e01d6e7abb2343c6b845d4945a368ed55cbf5bd2/types/aws-lambda/index.d.ts#L482
interface Response {
  statusCode: number
  headers?: {
    [header: string]: boolean | number | string
  }
  body: string
}

export const index: Handler = async (event: any = {}, context: Context): Promise<any> => {
  
  const cookies: string = event.hasOwnProperty('headers') && event.headers.hasOwnProperty('Cookie')
        ? cookie.parse(event.headers.Cookie) : ''
  
  const ssrBody: string = await util.promisify(ssr)(event, cookies)
  
  const response: Response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: ssrBody
  }
  
  return response
}
