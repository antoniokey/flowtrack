import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { LoginResponse, User } from '@flowtrack/types';

import { Observable } from 'rxjs';

import { AUTH_MICROSERVICE } from 'src/core/constants/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly authMicroservice: ClientRMQ,
  ) {}

  login(user: Omit<User, 'password'>): Observable<LoginResponse> {
    return this.authMicroservice.send('login', user);
  }

  register(user: User): Observable<Omit<User, 'password'>> {
    return this.authMicroservice.send('register', user);
  }
}
