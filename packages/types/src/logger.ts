import { LogEventEnvironment, LogEventLevel } from '@flowtrack/constants';

export interface LogEventContext {
  ip: string;
  method: string;
  path: string;
  userAgent: string;
  correlationId: string;
}

export interface LogEvent {
  level: LogEventLevel | null;
  environment: LogEventEnvironment;
  service: string;
  operation: string;
  userId: string;
  data: unknown;
  context: LogEventContext;
  error?: unknown;
}
