import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { User, WithoutPasswordUser } from '@flowtrack/types';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @GrpcMethod('UsersService', 'FindOneBy')
  async findOneBy(filter: unknown): Promise<User> {
    return this.usersService.findOneBy(filter);
  }

  @GrpcMethod('UsersService', 'CreateOne')
  async createOne(user: User): Promise<WithoutPasswordUser> {
    return this.usersService.createOne(user);
  }
}
