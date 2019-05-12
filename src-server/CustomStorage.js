// https://aws-amplify.github.io/docs/js/authentication#managing-security-tokens
import * as Cookies from 'js-cookie';

export default class CustomStorage {

  constructor(data) {
    
    // Dummy property to bypass isEmpty() check.
    // https://github.com/aws-amplify/amplify-js/commit/816a827d16a8736d61ec571e19207c9a6b062d97#diff-1cf5b10c87e919f81d5f1ea503f15074
    //this._dummy_property = "dummy"
    
    Object.keys(data).forEach(key => {
      this[key] = data[key]
    })
  }

  setItem(key, value) {
    this[key] = value
    return value
  }

  getItem(key) {
    return this[key]
  }

  removeItem(key) {
    return Cookies.remove(key, {
      path: this.path,
      domain: this.domain,
      secure: this.secure,
    });
  }

  clear() {
    const cookies = Cookies.get();
    let index;
    for (index = 0; index < cookies.length; ++index) {
      Cookies.remove(cookies[index]);
    }
    return {};
  }
}
