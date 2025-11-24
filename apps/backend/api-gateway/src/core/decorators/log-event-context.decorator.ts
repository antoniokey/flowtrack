import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { LogEventContext as ILogEventContext } from '@flowtrack/types';

import { v4 as uuid } from 'uuid';

export const LogEventContext = createParamDecorator<
  unknown,
  ExecutionContext,
  ILogEventContext
>((data: unknown, context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const req = ctx.getRequest();

  return {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get('user-agent'),
    correlationId: uuid(),
  };
});
