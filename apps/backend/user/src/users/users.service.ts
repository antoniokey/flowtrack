import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import { WithoutPasswordUser, User as IUser } from '@flowtrack/types';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async findOneBy(filter: unknown): Promise<IUser> {
    return this.userRepository.findOneBy(filter);
  }

  async createOne(user: IUser): Promise<WithoutPasswordUser> {
    const { email, name, password } = user;

    const existingUser = await this.userRepository.exists({
      where: { email },
    });

    if (existingUser) {
      throw new RpcException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({ email, name, password: hashedPassword });
  }
}
