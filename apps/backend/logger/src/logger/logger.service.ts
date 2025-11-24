import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LogEvent as ILogEvent } from '@flowtrack/types';

import { Model } from 'mongoose';

import { LogEvent } from './schemas/log-event.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(LogEvent.name)
    private readonly logEventModel: Model<ILogEvent>,
  ) {}

  logEvent(logEvent: ILogEvent): void {
    this.logEventModel.create(logEvent);
  }
}
