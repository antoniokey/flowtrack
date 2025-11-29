import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Observable } from 'rxjs';

const tokenPrefix = 'access_token=';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieHeader = request.headers.cookie;

    const accessToken = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(tokenPrefix))
      ?.split('=')[1];

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      request.user = this.jwtService.verify(accessToken);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
