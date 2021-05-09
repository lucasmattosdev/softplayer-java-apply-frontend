export default class AuthUtil {
  static logout(){
    window.localStorage.clear();
    window.location.href = "/login";
  }
}