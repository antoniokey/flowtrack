import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Observable } from 'rxjs';

import { TokenType } from '@flowtrack/constants';

import { IS_PUBLIC_KEY } from '../constants/session';
import { parseCookieFromHeader } from '../utils/parseCookieFromHeader';

@Injectable()
export class SessionUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken =
      request.cookies[TokenType.ACCESS_TOKEN] ||
      (request.headers.cookie &&
        parseCookieFromHeader(request.headers.cookie, TokenType.ACCESS_TOKEN));

    if (!accessToken) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const tokenData = this.jwtService.verify(accessToken);

      request.user = { id: +tokenData.sub };

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
