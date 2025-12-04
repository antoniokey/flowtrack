import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FINANCE_MICROSERVICE } from '@flowtrack/constants';

import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: FINANCE_MICROSERVICE,
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URL')],
              queue: configService.get<string>(
                'FINANCE_MICROSERVICE_RMQ_QUEUE',
              ),
              queueOptions: {
                durable: false,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule { }
