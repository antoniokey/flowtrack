import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as path from 'path';

import { USER_MICROSERVICE } from 'src/core/constants/microservices';
import { SessionUserGuard } from 'src/core/guards/session-user.guard';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_MICROSERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: path.join(__dirname, '../../../user/src/users/user.proto'),
        },
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, SessionUserGuard],
})
export class UserModule { }
