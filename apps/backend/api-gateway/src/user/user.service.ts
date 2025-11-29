/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { User, WithoutPasswordUser } from '@flowtrack/types';

import { firstValueFrom } from 'rxjs';

import { USER_MICROSERVICE } from 'src/core/constants/microservices';

@Injectable()
export class UserService {
  private readonly usersService: any;

  constructor(
    @Inject(USER_MICROSERVICE) private readonly userMicroservice: ClientGrpc,
  ) {
    this.usersService = this.userMicroservice.getService('UsersService');
  }

  async getMe(id: number): Promise<WithoutPasswordUser> {
    const user: User = await firstValueFrom(
      this.usersService.findOneBy({ id }),
    );

    const { password, ...restUser } = user;

    return restUser;
  }
}
