import axios from 'axios';

export default class AbstractService {
  constructor(pathprefix){
    this.pathprefix = pathprefix + "/";
  }

  get(path, data){
    return axios.get(this.pathprefix+path, {params: data});
  }

  put(path, data){
    return axios.put(this.pathprefix+path, data);
  }

  post(path, data){
    return axios.post(this.pathprefix+path, data);
  }

  delete(path, data){
    return axios.delete(this.pathprefix+path, {params: data});
  }
}