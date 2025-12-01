import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '../constants/api.constants';

const tokenPrefix = 'access_token=';

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
    const cookieHeader = request.headers.cookie;

    const accessToken = cookieHeader
      ?.split(';')
      ?.map((c) => c.trim())
      ?.find((c) => c.startsWith(tokenPrefix))
      ?.split('=')[1];

    if (!accessToken) {
      throw new UnauthorizedException();
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
