import * as Cookies from 'js-cookie';

export default class CookieStorage {

  path: string
  expires: number
  secure: boolean
  
  constructor() {
    this.path = '/';
    this.expires = 365;
    this.secure = false;
  }

  setItem(key: string, value: string) {
    console.log('LocalCookie setItem ' + key)
    Cookies.set(key, value,{
      path: this.path,
      expires: this.expires,
      secure: this.secure,
    });
    return Cookies.get(key);
  }

  getItem(key: string) {
    console.log('LocalCookie getItem ' + key)
    return Cookies.get(key);
  }

  removeItem(key: string) {
    return Cookies.remove(key, {
      path: this.path,
      secure: this.secure,
    });
  }
  
  clear() {
    const cookies = Cookies.get();
    let length: number = parseInt(cookies.length)
    for (let i: number = 0; i < length; ++i) {
      Cookies.remove(cookies[i]);
    }
    return {};
  }
}
