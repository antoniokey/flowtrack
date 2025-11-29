import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { TokenType } from '@flowtrack/constants';
import { LogEventContext as ILogEventContext } from '@flowtrack/types';

import { Response } from 'express';
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
import { CreateUserResponse } from './types/auth.types';

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
  async login(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginUserResponseDto> {
    const loginUserResponse = await this.authService.login(
      user,
      logEventContext,
    );

    response.cookie(
      TokenType.ACCESS_TOKEN,
      loginUserResponse.access_token,
      this.authService.getCookieData(TokenType.ACCESS_TOKEN),
    );
    response.cookie(
      TokenType.REFRESH_TOKEN,
      loginUserResponse.refresh_token,
      this.authService.getCookieData(TokenType.REFRESH_TOKEN),
    );

    return { ok: true };
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
