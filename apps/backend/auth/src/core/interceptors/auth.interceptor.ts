import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { LogEvent } from '@flowtrack/types';
import { LogEventEnvironment, LogEventLevel } from '@flowtrack/constants';

import { catchError, Observable, tap } from 'rxjs';

export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly loggerMicroservice: ClientProxy) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc();
    const payload = ctx.getData();

    const logEvent: LogEvent = {
      level: null,
      environment: process.env.NODE_ENV as LogEventEnvironment,
      service: 'auth-service',
      operation: payload.logEvent.operation || 'unknown',
      userId: payload.data.userId || null,
      data: payload.data,
      context: payload.logEvent.context,
    };

    return next.handle().pipe(
      tap(() => {
        this.loggerMicroservice.emit('logEvent', {
          ...logEvent,
          level: LogEventLevel.INFO,
        });
      }),
      catchError((error) => {
        this.loggerMicroservice.emit('logEvent', {
          ...logEvent,
          error: error.error ?? { status: 400, message: error.message },
          level: LogEventLevel.ERROR,
        });

        throw new RpcException(
          error.error ?? { status: 400, message: error.message },
        );
      }),
    );
  }
}
