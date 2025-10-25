/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '@flowtrack/types';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    const { password: userPassword, ...restUser } = user;

    return restUser;
  }

  async login(user: Omit<User, 'password'>): Promise<LoginResponse> {
    const payload = { ...user };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(payload: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password, ...registeredUser } =
      await this.userService.create(payload);

    return registeredUser;
  }
}
