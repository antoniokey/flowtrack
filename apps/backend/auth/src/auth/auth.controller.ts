import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateUserResponse, LoginResponse } from '@flowtrack/types';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('login')
  async login(@Payload() payload: LoginUserDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      payload.data.email,
      payload.data.password,
    );

    return this.authService.login(user, payload.logEvent.context.ip);
  }

  @MessagePattern('register')
  async register(
    @Payload() payload: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.authService.register(payload);
  }

  @MessagePattern('logout')
  async logout(@Payload() payload: LogoutUserDto): Promise<number> {
    return this.authService.logout(payload.data.userId);
  }
}
