import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRMQ, ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { LOGGER_MICROSERVICE } from './core/constants/constants';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { Session } from './auth/entities/session';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: LOGGER_MICROSERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'log_events',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get('DATABASE_PORT'),
        host: configService.get('DATABASE_HOST'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [Session],
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (loggerMicroservice: ClientRMQ) =>
        new AuthInterceptor(loggerMicroservice),
      inject: [LOGGER_MICROSERVICE],
    },
  ],
})
export class AppModule { }
