import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { LogEventContext, LoginResponse, User } from '@flowtrack/types';

import { Observable } from 'rxjs';

import { AUTH_MICROSERVICE } from 'src/core/constants/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly authMicroservice: ClientRMQ,
  ) { }

  login(
    user: Omit<User, 'password'>,
    logEventContext: LogEventContext,
  ): Observable<LoginResponse> {
    return this.authMicroservice.send('login', {
      data: { ...user },
      logEvent: {
        operation: 'login',
        context: logEventContext,
      },
    });
  }

  register(
    user: User,
    logEventContext: LogEventContext,
  ): Observable<Omit<User, 'password'>> {
    return this.authMicroservice.send('register', {
      data: { ...user },
      logEvent: {
        operation: 'regiter',
        context: logEventContext,
      },
    });
  }
}
