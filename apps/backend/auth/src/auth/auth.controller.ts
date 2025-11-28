import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateUserResponse, LoginResponse } from '@flowtrack/types';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('login')
  async login(@Payload() payload: LoginUserDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      payload.data.email,
      payload.data.password,
    );

    return this.authService.login(user);
  }

  @MessagePattern('register')
  async register(
    @Payload() payload: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.authService.register(payload);
  }
}
