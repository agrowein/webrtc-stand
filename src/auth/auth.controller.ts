import {Body, Controller, HttpException, HttpStatus, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import {SignInDto} from './dto/SignIn.dto';
import {SignUpDto} from './dto/SignUp.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() dto: SignInDto) {
    try {
      return await this.authService.login(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/sign-up')
  async signUp(@Body() dto: SignUpDto) {
    try {
      return await this.authService.register(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
