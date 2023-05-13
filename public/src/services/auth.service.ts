import {HttpService} from "./http.service";
import {LoginDto} from "../dtos/Login.dto";
import {RegisterDto} from "../dtos/Register.dto";

export class AuthService extends HttpService {
  constructor() {
    super();
  }

  async login(dto: LoginDto) {
    return await this.axios.post('/sign-in', dto);
  }

  async register(dto: RegisterDto) {
    return await this.axios.post('/sign-in', dto);
  }
}