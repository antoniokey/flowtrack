import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { FinanceController } from './finance/finance.controller';
import { FinanceService } from './finance/finance.service';
import { FINANCE_MICROSERVICE } from './core/microservices';

@Module({
  imports: [
    ClientsModule.register([
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
  ],
  controllers: [AppController, FinanceController],
  providers: [FinanceService],
})
export class AppModule {}
