import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AUTH_MICROSERVICE } from '@flowtrack/constants';

import { SessionUserGuard } from 'src/core/guards/session-user.guard';
import { RefreshTokenGuard } from 'src/core/guards/refresh-token.guard';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: AUTH_MICROSERVICE,
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URL')],
              queue: configService.get<string>('AUTH_MICROSERVICE_RMQ_QUEUE'),
              queueOptions: {
                durable: false,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionUserGuard, RefreshTokenGuard],
})
export class AuthModule { }
