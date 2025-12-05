import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import {
  WithoutPasswordUser,
  LogEventContext as ILogEventContext,
} from '@flowtrack/types';

import { Request } from 'express';

import { SessionUserGuard } from 'src/core/guards/session-user.guard';

import { UserService } from './user.service';
import { LogEventContext } from 'src/core/decorators/log-event-context.decorator';

@UseGuards(SessionUserGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/me')
  async getMe(
    @LogEventContext() logEventContext: ILogEventContext,
    @Req() request: Request,
  ): Promise<WithoutPasswordUser> {
    return this.userService.getMe(request.user.id, logEventContext);
  }
}
