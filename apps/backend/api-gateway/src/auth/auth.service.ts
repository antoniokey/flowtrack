import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { TokenType } from '@flowtrack/constants';
import { LogEventContext, LoginResponse } from '@flowtrack/types';

import { CookieOptions } from 'express';
import { catchError, firstValueFrom, Observable } from 'rxjs';

import { AUTH_MICROSERVICE } from 'src/core/constants/microservices';

import { LoginUserDto, CreateUserDto } from './dto/auth.dto';
import { CreateUserResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly authMicroservice: ClientRMQ,
  ) { }

  login(
    user: LoginUserDto,
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
    user: CreateUserDto,
    logEventContext: LogEventContext,
  ): Observable<CreateUserResponse> {
    return this.authMicroservice
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
      );
  }

  getCookieData(tokenType: TokenType): CookieOptions {
    const cookieOptions: CookieOptions = {
      secure: true,
      sameSite: true,
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
