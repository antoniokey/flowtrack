/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { TokenType } from '@flowtrack/constants';
import {
  CreateUserResponse,
  LoginResponse,
  User,
  WithoutPasswordUser,
} from '@flowtrack/types';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { USER_MICROSERVICE } from 'src/core/constants/constants';

@Injectable()
export class AuthService {
  private readonly usersService: any;

  constructor(
    @Inject(USER_MICROSERVICE) private readonly userMicroservice: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {
    this.usersService = this.userMicroservice.getService('UsersService');
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user: User = await firstValueFrom(
        this.usersService.findOneBy({ email }),
      );

      const isPasswordMatch = bcrypt.compareSync(password, user.password);

      if (!isPasswordMatch) {
        throw new RpcException({
          error: {
            statusCode: 400,
            message: 'Password is incorrect',
          },
        });
      }

      return user;
    } catch (error) {
      throw new RpcException(JSON.parse(error.details));
    }
  }

  async login(user: User): Promise<LoginResponse> {
    const { password, ...restUser } = user;

    return {
      access_token: this.generateToken(TokenType.ACCESS_TOKEN, restUser),
      refresh_token: this.generateToken(TokenType.REFRESH_TOKEN, restUser),
    };
  }

  async register(payload: CreateUserDto): Promise<CreateUserResponse> {
    try {
      return await firstValueFrom(this.usersService.createOne(payload.data));
    } catch (error) {
      throw new RpcException(JSON.parse(error.details));
    }
  }

  private generateToken(
    tokenType: TokenType,
    user: WithoutPasswordUser,
  ): string {
    if (tokenType === TokenType.ACCESS_TOKEN) {
      return this.jwtService.sign(
        { sub: user.id },
        { expiresIn: 15 * 60 * 1000 },
      );
    } else {
      return this.jwtService.sign(
        { sub: user.id },
        { expiresIn: 7 * 24 * 60 * 60 * 1000 },
      );
    }
  }
}
