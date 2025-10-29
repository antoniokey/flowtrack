import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginResponse, User } from '@flowtrack/types';

import { catchError, Observable, throwError } from 'rxjs';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: Omit<User, 'password'>): Observable<LoginResponse> {
    return this.authService
      .login(user)
      .pipe(
        catchError((error) =>
          throwError(() => new BadRequestException(error.message)),
        ),
      );
  }

  @Post('register')
  register(@Body() user: User): Observable<Omit<User, 'password'>> {
    return this.authService
      .register(user)
      .pipe(
        catchError((error) =>
          throwError(() => new BadRequestException(error.message)),
        ),
      );
  }
}
