import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { LogEventContext as ILogEventContext } from '@flowtrack/types';

import { Observable } from 'rxjs';

import { LogEventContext } from 'src/core/decorators/log-event-context.decorator';

import { AuthService } from './auth.service';
import {
  LoginUserResponseDto,
  LoginUserBadRequestDto,
  CreateUserBadRequestDto,
  CreateUserResponseDto,
  LoginUserDto,
  CreateUserDto,
} from './dto/auth.dto';
import { CreateUserResponse, LoginUserResponse } from './types/auth.types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOkResponse({ description: 'Login success', type: LoginUserResponseDto })
  @ApiBadRequestResponse({
    description: 'Login failed',
    type: LoginUserBadRequestDto,
  })
  @HttpCode(200)
  @Post('login')
  login(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: LoginUserDto,
  ): Observable<LoginUserResponse> {
    return this.authService.login(user, logEventContext);
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
  ): Observable<CreateUserResponse> {
    return this.authService.register(user, logEventContext);
  }
}
