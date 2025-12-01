import { LogEvent } from '@flowtrack/types';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class UserDataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  data: UserDataDto;

  @IsNotEmpty()
  logEvent: LogEvent;
}
