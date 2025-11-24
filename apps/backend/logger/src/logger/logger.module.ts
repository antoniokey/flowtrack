import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEvent, LogEventSchema } from './schemas/log-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogEvent.name, schema: LogEventSchema },
    ]),
  ],
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule { }
