
import axios from 'axios';
import AuthUtil from './auth-util';

export default class AxiosUtil{
  static configure() {
    let urlServer = process.env.REACT_APP_API_URL;
    axios.defaults.baseURL = urlServer;
    this.updateAuthorization();
    axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.common['Client-Id'] = '5D6CC0D0-F1ED-40FD-AB8E-C932C236088A';

    axios.interceptors.response.use(response => {
      return response;
    }, error => {
        console.error("Request ERROR: ",error);
        if (!error.response && window.location.pathname !== "/login"){
          AuthUtil.logout();
        }
        return Promise.reject(error);
    });
  }

  static updateAuthorization(){
    if (window.localStorage.credential !== undefined){
      axios.defaults.headers.common['Authorization'] = 'BASIC '+window.localStorage.credential;
    }
  }
}