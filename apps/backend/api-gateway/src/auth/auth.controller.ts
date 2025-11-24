import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import {
  LogEventContext as ILogEventContext,
  LoginResponse,
  User,
} from '@flowtrack/types';

import { catchError, Observable, throwError } from 'rxjs';

import { LogEventContext } from 'src/core/decorators/log-event-context.decorator';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: Omit<User, 'password'>,
  ): Observable<LoginResponse> {
    return this.authService
      .login(user, logEventContext)
      .pipe(
        catchError((error) =>
          throwError(() => new BadRequestException(error.message)),
        ),
      );
  }

  @Post('register')
  register(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: User,
  ): Observable<Omit<User, 'password'>> {
    return this.authService
      .register(user, logEventContext)
      .pipe(
        catchError((error) =>
          throwError(() => new BadRequestException(error.message)),
        ),
      );
  }
}
