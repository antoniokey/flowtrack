import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { LogEventContext } from '@flowtrack/types';

import { map, Observable } from 'rxjs';

import { AUTH_MICROSERVICE } from 'src/core/constants/microservices';

import {
  LoginUserBadRequestDto,
  CreateUserBadRequestDto,
  LoginUserDto,
  CreateUserDto,
} from './dto/auth.dto';
import { CreateUserResponse, LoginUserResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly authMicroservice: ClientRMQ,
  ) { }

  login(
    user: LoginUserDto,
    logEventContext: LogEventContext,
  ): Observable<LoginUserResponse> {
    return this.authMicroservice
      .send('login', {
        data: { ...user },
        logEvent: {
          operation: 'login',
          context: logEventContext,
        },
      })
      .pipe(
        map((response: LoginUserResponse) => {
          if ((response as LoginUserBadRequestDto).error) {
            throw new BadRequestException(
              (response as LoginUserBadRequestDto).error,
            );
          }

          return response;
        }),
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
        map((response: CreateUserResponse) => {
          if ((response as CreateUserBadRequestDto).error) {
            throw new BadRequestException(
              (response as CreateUserBadRequestDto).error,
            );
          }

          return response;
        }),
      );
  }
}
