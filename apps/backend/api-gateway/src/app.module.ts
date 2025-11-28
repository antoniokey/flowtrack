import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  AUTH_MICROSERVICE,
  FINANCE_MICROSERVICE,
} from './core/constants/microservices';

import { FinanceModule } from './finance/finance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_MICROSERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: FINANCE_MICROSERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'finance_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    FinanceModule,
    AuthModule,
  ],
})
export class AppModule { }
