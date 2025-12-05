import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { User, WithoutPasswordUser } from '@flowtrack/types';

import { UsersService } from './users.service';
import { FindOneByDto } from './dto/find-one-by.dto';
import { CreateOneDto } from './dto/create-one.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @GrpcMethod('UsersService', 'FindOneBy')
  async findOneBy(findOneByDto: FindOneByDto): Promise<User> {
    return this.usersService.findOneBy(findOneByDto);
  }

  @GrpcMethod('UsersService', 'CreateOne')
  async createOne(createOneDto: CreateOneDto): Promise<WithoutPasswordUser> {
    return this.usersService.createOne(createOneDto);
  }
}
