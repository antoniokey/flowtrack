import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { USER_MICROSERVICE, ENVIRONMENT_VARIABLES } from '@flowtrack/constants';

import * as path from 'path';

import { SessionUserGuard } from 'src/core/guards/session-user.guard';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: USER_MICROSERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: 'user',
              protoPath: path.join(
                __dirname,
                '../../../user/src/users/user.proto',
              ),
              url: configService.get<string>(
                ENVIRONMENT_VARIABLES.USER_MICROSERVICE_GRPC_URL,
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
  controllers: [UserController],
  providers: [UserService, SessionUserGuard],
})
export class UserModule { }
