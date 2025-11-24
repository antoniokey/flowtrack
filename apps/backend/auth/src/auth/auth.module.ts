import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
