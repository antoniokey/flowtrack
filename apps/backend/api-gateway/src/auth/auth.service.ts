import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { LogEventContext } from '@flowtrack/types';

import { Observable } from 'rxjs';

import { AUTH_MICROSERVICE } from 'src/core/constants/microservices';

import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly authMicroservice: ClientRMQ,
  ) { }

  login(
    user: LoginUserDto,
    logEventContext: LogEventContext,
  ): Observable<LoginUserResponseDto> {
    return this.authMicroservice.send('login', {
      data: { ...user },
      logEvent: {
        operation: 'login',
        context: logEventContext,
      },
    });
  }

  register(
    user: CreateUserDto,
    logEventContext: LogEventContext,
  ): Observable<CreateUserResponseDto> {
    return this.authMicroservice.send('register', {
      data: { ...user },
      logEvent: {
        operation: 'regiter',
        context: logEventContext,
      },
    });
  }
}
