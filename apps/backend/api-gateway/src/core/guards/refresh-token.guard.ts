import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenType } from '@flowtrack/constants';

import { Observable } from 'rxjs';

import { parseCookieFromHeader } from '../utils/parseCookieFromHeader';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken =
      request.cookies[TokenType.REFRESH_TOKEN] ||
      (request.headers.cookie &&
        parseCookieFromHeader(request.headers.cookie, TokenType.REFRESH_TOKEN));

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      request.refreshToken = refreshToken;
      request.user = { id: +payload.sub };

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
