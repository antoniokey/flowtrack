import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import {
  LogEventContext as ILogEventContext,
  LoginResponse,
} from '@flowtrack/types';

import { catchError, Observable, throwError } from 'rxjs';

import { LogEventContext } from 'src/core/decorators/log-event-context.decorator';

import { AuthService } from './auth.service';
import {
  LoginUserBadRequestDto,
  LoginUserDto,
  LoginUserResponseDto,
} from './dto/login-user.dto';
import {
  CreateUserBadRequestDto,
  CreateUserDto,
  CreateUserResponseDto,
} from './dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOkResponse({ description: 'Login success', type: LoginUserResponseDto })
  @ApiBadRequestResponse({
    description: 'Login failed',
    type: LoginUserBadRequestDto,
  })
  @Post('login')
  login(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: LoginUserDto,
  ): Observable<LoginResponse> {
    return this.authService
      .login(user, logEventContext)
      .pipe(
        catchError((error) =>
          throwError(() => new BadRequestException(error.message)),
        ),
      );
  }

  @ApiCreatedResponse({
    description: 'Register success',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Register failed',
    type: CreateUserBadRequestDto,
  })
  @Post('register')
  register(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: CreateUserDto,
  ): Observable<CreateUserResponseDto> {
    return this.authService
      .register(user, logEventContext)
      .pipe(
        catchError((error) =>
          throwError(() => new BadRequestException(error.message)),
        ),
      );
  }
}
