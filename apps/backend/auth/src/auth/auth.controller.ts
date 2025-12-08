import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';

import { CreateUserResponse, LoginResponse } from '@flowtrack/types';

import { DeleteResult } from 'typeorm';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @GrpcMethod('AuthService', 'Login')
  async login(@Payload() payload: LoginUserDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      payload.data.email,
      payload.data.password,
      payload.logEvent.context,
    );

    return this.authService.login(user, payload.logEvent.context.ip);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(
    @Payload() payload: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.authService.register(payload, payload.logEvent.context);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(@Payload() payload: LogoutUserDto): Promise<DeleteResult> {
    return this.authService.logout(payload.data.userId);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(
    @Payload() payload: RefreshTokenDto,
  ): Promise<LoginResponse> {
    return this.authService.refreshToken(
      payload.data.refresh_token,
      payload.logEvent.context,
    );
  }
}
