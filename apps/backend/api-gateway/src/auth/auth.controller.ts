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
import {
  ErrorDto,
  LogEventContext as ILogEventContext,
  SuccessResponseDto,
} from '@flowtrack/types';

import { Request, Response } from 'express';

import { LogEventContext } from 'src/core/decorators/log-event-context.decorator';
import { SessionUserGuard } from 'src/core/guards/session-user.guard';
import { Public } from 'src/core/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/core/guards/refresh-token.guard';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.dto';
import { CreateRequestUserDto } from './dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOkResponse({ description: 'Login success', type: SuccessResponseDto })
  @ApiBadRequestResponse({
    description: 'Login failed',
    type: ErrorDto,
  })
  @HttpCode(200)
  @Public()
  @Post('login')
  async login(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
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
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Register failed',
    type: ErrorDto,
  })
  @Public()
  @Post('register')
  async register(
    @LogEventContext() logEventContext: ILogEventContext,
    @Body() user: CreateRequestUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    await this.authService.register(user, logEventContext);

    return response.json({ ok: true });
  }

  @ApiCreatedResponse({
    description: 'Logout success',
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Logout failed',
    type: ErrorDto,
  })
  @HttpCode(200)
  @Post('logout')
  @UseGuards(SessionUserGuard)
  async logout(
    @LogEventContext() logEventContext: ILogEventContext,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    await this.authService.logout(request.user.id, logEventContext);

    response.clearCookie(TokenType.ACCESS_TOKEN);
    response.clearCookie(TokenType.REFRESH_TOKEN);

    return response.json({ ok: true });
  }

  @ApiCreatedResponse({
    description: 'Refresh token success',
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Refresh token failed',
    type: ErrorDto,
  })
  @HttpCode(200)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @LogEventContext() logEventContext: ILogEventContext,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
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
