import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { LogEvent as ILogEvent } from '@flowtrack/types';

import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @EventPattern('logEvent')
  async logEvent(logEvent: ILogEvent): Promise<void> {
    this.loggerService.logEvent(logEvent);
  }
}
