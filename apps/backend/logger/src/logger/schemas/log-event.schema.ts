import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LogEventContext } from '@flowtrack/types';
import { LogEventLevel, LogEventEnvironment } from '@flowtrack/constants';

import { HydratedDocument } from 'mongoose';

export type LogEventDocument = HydratedDocument<LogEvent>;

@Schema({ timestamps: true })
export class LogEvent {
  @Prop({ type: String, enum: LogEventLevel })
  level: LogEventLevel;

  @Prop()
  service: string;

  @Prop({ type: String, enum: LogEventEnvironment })
  environment: LogEventEnvironment;

  @Prop()
  userId: string;

  @Prop()
  operation: string;

  @Prop({ type: Object })
  data: unknown;

  @Prop({ type: Object })
  context: LogEventContext;

  @Prop({ type: Object })
  error: unknown;
}

export const LogEventSchema = SchemaFactory.createForClass(LogEvent);
