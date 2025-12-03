/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { TokenType, USER_MICROSERVICE } from '@flowtrack/constants';
import {
  CreateUserResponse,
  LoginResponse,
  User,
  WithoutPasswordUser,
} from '@flowtrack/types';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';

import { Session } from './entities/session';

@Injectable()
export class AuthService {
  private readonly usersService: any;

  constructor(
    @Inject(USER_MICROSERVICE) private readonly userMicroservice: ClientGrpc,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
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

  async login(user: User, ip: string): Promise<LoginResponse> {
    const { password, ...restUser } = user;

    const access_token = this.generateToken(TokenType.ACCESS_TOKEN, restUser);
    const refresh_token = this.generateToken(TokenType.REFRESH_TOKEN, restUser);

    await this.createSession(user.id, refresh_token, ip);

    return {
      access_token,
      refresh_token,
    };
  }

  async register(payload: CreateUserDto): Promise<CreateUserResponse> {
    try {
      return this.usersService.createOne(payload.data);
    } catch (error) {
      throw new RpcException(JSON.parse(error.details));
    }
  }

  async logout(userId: number): Promise<DeleteResult> {
    try {
      return await this.sessionRepository.delete({ userId });
    } catch (error) {
      throw new RpcException(JSON.parse(error.details));
    }
  }

  async refreshToken(refresh_token: string): Promise<LoginResponse> {
    const refreshTokenPayload = this.jwtService.verify(refresh_token);

    const userId = +refreshTokenPayload.sub;

    const session = await this.sessionRepository.findOneBy({ userId });

    if (!session) {
      throw new RpcException({
        error: {
          statusCode: 400,
          message: 'Session not found',
        },
      });
    }

    const isSessionOk = await bcrypt.compare(
      refresh_token,
      session.refreshToken,
    );

    if (!isSessionOk) {
      throw new RpcException({
        error: {
          statusCode: 400,
          message: 'Refresh token in not valid',
        },
      });
    }

    const user: User = await firstValueFrom(
      this.usersService.findOneBy({ id: userId }),
    );

    if (!user) {
      throw new RpcException({
        error: {
          statusCode: 400,
          message: 'User not found',
        },
      });
    }

    const newAccessToken = this.generateToken(TokenType.ACCESS_TOKEN, user);
    const newRefreshToken = this.generateToken(TokenType.REFRESH_TOKEN, user);

    session.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    this.sessionRepository.save(session);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  private async createSession(
    userId: number,
    refresh_token: string,
    ip: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refresh_token, 10);

    const session = this.sessionRepository.create(
      this.generateSession(userId, ip, hash),
    );

    await this.sessionRepository.save(session);
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

  private generateSession(
    userId: number,
    ip: string,
    hash: string,
  ): Omit<Session, 'id' | 'createdAt'> {
    return {
      userId,
      ip,
      refreshToken: hash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }
}
