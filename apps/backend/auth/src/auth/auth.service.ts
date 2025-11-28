/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { CreateUserResponse, LoginResponse, User } from '@flowtrack/types';

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
    const user: User = await firstValueFrom(
      this.usersService.findOneBy({ email }),
    );

    if (!user) {
      throw new RpcException({
        error: {
          statusCode: 404,
          message: 'User not found',
        },
      });
    }

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
  }

  async login(user: User): Promise<LoginResponse> {
    const { password, ...restUser } = user;

    return {
      access_token: this.jwtService.sign(restUser),
    };
  }

  async register(payload: CreateUserDto): Promise<CreateUserResponse> {
    return firstValueFrom(this.usersService.createOne(payload.data));
  }
}
