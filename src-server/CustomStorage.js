// https://aws-amplify.github.io/docs/js/authentication#managing-security-tokens
import * as Cookies from 'js-cookie';

export default class CustomStorage {

  constructor(data) {
    this.a = "foo"
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
