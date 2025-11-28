import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { LogEventContext } from '@flowtrack/types';

import { catchError, Observable } from 'rxjs';

import { AUTH_MICROSERVICE } from 'src/core/constants/microservices';

import { LoginUserDto, CreateUserDto } from './dto/auth.dto';
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
        catchError((error) => {
          throw new BadRequestException(error.error);
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
        catchError((error) => {
          throw new BadRequestException(error.error);
        }),
      );
  }
}
