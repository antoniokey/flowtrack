import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import { WithoutPasswordUser, User as IUser } from '@flowtrack/types';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { FindOneByDto } from './dto/find-one-by.dto';
import { CreateOneDto } from './dto/create-one.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async findOneBy(findOneByDto: FindOneByDto): Promise<IUser> {
    const user = await this.userRepository.findOneBy(findOneByDto.data);

    if (!user) {
      throw new RpcException(
        JSON.stringify({
          statusCode: 404,
          message: 'User not found',
        }),
      );
    }

    return user;
  }

  async createOne(createOneDto: CreateOneDto): Promise<WithoutPasswordUser> {
    const { email, name, password } = createOneDto.data;

    const existingUser = await this.userRepository.exists({
      where: { email },
    });

    if (existingUser) {
      throw new RpcException(
        JSON.stringify({
          statusCode: 400,
          message: 'User already exists',
        }),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({ email, name, password: hashedPassword });
  }
}
