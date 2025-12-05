import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRMQ, ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LOGGER_MICROSERVICE } from '@flowtrack/constants';
import { LoggerInterceptor } from '@flowtrack/libs-backend';

import { AuthModule } from './auth/auth.module';
import { Session } from './auth/entities/session';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: LOGGER_MICROSERVICE,
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URL')],
              queue: configService.get<string>('LOGGER_MICROSERVICE_RMQ_QUEUE'),
              queueOptions: {
                durable: false,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
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
        new LoggerInterceptor(loggerMicroservice, 'auth-service'),
      inject: [LOGGER_MICROSERVICE],
    },
  ],
})
export class AppModule { }
