import axios from 'axios';

export class HttpService {
  protected axios;

  constructor() {
    axios.defaults.baseURL = process.env.REACT_APP_HOST;

    this.axios = axios;
  }


}