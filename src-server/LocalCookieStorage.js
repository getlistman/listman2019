import * as Cookies from 'js-cookie';

export default class CookieStorage {

  constructor(data) {
    this.path = '/';
    this.expires = 365;
    this.secure = false;
  }

  setItem(key, value) {
    Cookies.set(key, value,{
      path: this.path,
      expires: this.expires,
      secure: this.secure,
    });
    return Cookies.get(key);
  }

  getItem(key) {
    return Cookies.get(key);
  }

  removeItem(key) {
    return Cookies.remove(key, {
      path: this.path,
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
