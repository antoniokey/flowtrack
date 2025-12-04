import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USER_MICROSERVICE } from '@flowtrack/constants';

import * as path from 'path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entities/session';

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
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([Session]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
