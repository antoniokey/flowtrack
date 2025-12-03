import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { TokenType, AUTH_MICROSERVICE } from '@flowtrack/constants';
import {
  CreateUserResponse,
  LogEventContext,
  LoginResponse,
} from '@flowtrack/types';

import { CookieOptions } from 'express';
import { catchError, firstValueFrom } from 'rxjs';

import { LoginRequestDto } from './dto/login.dto';
import { CreateRequestUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly authMicroservice: ClientRMQ,
  ) { }

  login(
    user: LoginRequestDto,
    logEventContext: LogEventContext,
  ): Promise<LoginResponse> {
    return firstValueFrom(
      this.authMicroservice
        .send('login', {
          data: { ...user },
          logEvent: {
            operation: 'login',
            context: logEventContext,
          },
        })
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.error);
          }),
        ),
    );
  }

  register(
    user: CreateRequestUserDto,
    logEventContext: LogEventContext,
  ): Promise<CreateUserResponse> {
    return firstValueFrom(
      this.authMicroservice
        .send('register', {
          data: { ...user },
          logEvent: {
            operation: 'regiter',
            context: logEventContext,
          },
        })
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.error);
          }),
        ),
    );
  }

  logout(userId: number, logEventContext: LogEventContext): Promise<void> {
    return firstValueFrom(
      this.authMicroservice
        .send('logout', {
          data: { userId },
          logEvent: {
            operation: 'logout',
            context: logEventContext,
          },
        })
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.error);
          }),
        ),
    );
  }

  refreshToken(
    refresh_token: string,
    logEventContext: LogEventContext,
  ): Promise<LoginResponse> {
    return firstValueFrom(
      this.authMicroservice
        .send('refresh_token', {
          data: { refresh_token },
          logEvent: {
            operation: 'refreshToken',
            context: logEventContext,
          },
        })
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.error);
          }),
        ),
    );
  }

  getCookieData(tokenType: TokenType): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions: CookieOptions = {
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      httpOnly: true,
    };

    if (tokenType === TokenType.ACCESS_TOKEN) {
      cookieOptions.maxAge = 60 * 60 * 24 * 7;
    } else {
      cookieOptions.maxAge = 60 * 60 * 24 * 7 * 2;
    }

    return cookieOptions;
  }
}
