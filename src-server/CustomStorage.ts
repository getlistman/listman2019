// https://aws-amplify.github.io/docs/js/authentication#managing-security-tokens
import * as Cookies from 'js-cookie';

export default class CustomStorage {

  [key: string]: any

  constructor(data: any) {
    
    // Dummy property to bypass isEmpty() check.
    // https://github.com/aws-amplify/amplify-js/commit/816a827d16a8736d61ec571e19207c9a6b062d97#diff-1cf5b10c87e919f81d5f1ea503f15074
    this["_dummy_property"] = "dummy"
    
    Object.keys(data).forEach(key => {
      this[key] = data[key]
    })
  }

  setItem(key: string, value: string): string {
    this[key] = value
    return value
  }

  getItem(key: string): string {
    return this[key]
  }

  removeItem(key: string): any {
    return {}
  }

  clear(): any {
    return {};
  }
}
