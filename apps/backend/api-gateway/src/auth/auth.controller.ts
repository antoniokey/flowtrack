import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { TokenType } from '@flowtrack/constants';
import { LogEventContext as ILogEventContext } from '@flowtrack/types';

import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import { LogEventContext } from 'src/core/decorators/log-event-context.decorator';
import { SessionUserGuard } from 'src/core/guards/session-user.guard';
import { Public } from 'src/core/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/core/guards/refresh-token.guard';

import { AuthService } from './auth.service';
import {
  LoginUserResponseDto,
  LoginUserBadRequestDto,
  CreateUserBadRequestDto,
  CreateUserResponseDto,
  LoginUserDto,
  CreateUserDto,
  LogoutUserDtoResponse,
  LogoutUserBadRequestDto,
  RefreshTokenDtoResponse,
  RefreshTokenBadRequestDto,
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
  @Public()
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

    return response.json({ ok: true });
  }

  @ApiCreatedResponse({
    description: 'Register success',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Register failed',
    type: CreateUserBadRequestDto,
  })
  @Public()
  @Post('register')
  register(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: CreateUserDto,
  ): Observable<CreateUserResponse> {
    return this.authService.register(user, logEventContext);
  }

  @ApiCreatedResponse({
    description: 'Logout success',
    type: LogoutUserDtoResponse,
  })
  @ApiBadRequestResponse({
    description: 'Logout failed',
    type: LogoutUserBadRequestDto,
  })
  @HttpCode(200)
  @Post('logout')
  @UseGuards(SessionUserGuard)
  async logout(
    @LogEventContext() logEventContext: ILogEventContext,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutUserDtoResponse> {
    await this.authService.logout(request.user.id, logEventContext);

    response.clearCookie(TokenType.ACCESS_TOKEN);
    response.clearCookie(TokenType.REFRESH_TOKEN);

    return response.json({ ok: true });
  }

  @ApiCreatedResponse({
    description: 'Refresh token success',
    type: RefreshTokenDtoResponse,
  })
  @ApiBadRequestResponse({
    description: 'Refresh token failed',
    type: RefreshTokenBadRequestDto,
  })
  @HttpCode(200)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @LogEventContext() logEventContext: ILogEventContext,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenDtoResponse> {
    const refreshTokenResponse = await this.authService.refreshToken(
      request.refreshToken,
      logEventContext,
    );

    response.cookie(
      TokenType.ACCESS_TOKEN,
      refreshTokenResponse.access_token,
      this.authService.getCookieData(TokenType.ACCESS_TOKEN),
    );
    response.cookie(
      TokenType.REFRESH_TOKEN,
      refreshTokenResponse.refresh_token,
      this.authService.getCookieData(TokenType.REFRESH_TOKEN),
    );

    return response.json({ ok: true });
  }
}
