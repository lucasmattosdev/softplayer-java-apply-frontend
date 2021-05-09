export default class AuthUtil {
  static logout(){
    window.localStorage.clear();
    window.location.href = "/login";
  }
  static saveLogin(nome, senhaCrip){
    window.localStorage.nome = nome;
    window.localStorage.credential = btoa(nome+":"+senhaCrip);
    window.location.href = "/";
  }
}