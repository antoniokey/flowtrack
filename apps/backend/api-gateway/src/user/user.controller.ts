import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { WithoutPasswordUser } from '@flowtrack/types';

import { Request } from 'express';

import { SessionUserGuard } from 'src/core/guards/session-user.guard';

import { UserService } from './user.service';

@UseGuards(SessionUserGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/me')
  async getMe(@Req() request: Request): Promise<WithoutPasswordUser> {
    return this.userService.getMe(request.user.id);
  }
}
