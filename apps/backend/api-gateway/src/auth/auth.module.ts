import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as path from 'path';

import { AUTH_MICROSERVICE, ENVIRONMENT_VARIABLES } from '@flowtrack/constants';

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
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: 'auth',
              protoPath: path.join(
                __dirname,
                '../../../auth/src/auth/auth.proto',
              ),
              url: configService.get<string>(
                ENVIRONMENT_VARIABLES.AUTH_MICROSERVICE_GRPC_URL,
              ),
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ENVIRONMENT_VARIABLES.JWT_SECRET),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionUserGuard, RefreshTokenGuard],
})
export class AuthModule { }
