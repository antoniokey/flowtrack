import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.exists({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new RpcException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    return this.userRepository.save({ ...user, password: hashedPassword });
  }
}
