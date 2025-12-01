import { LogEvent } from '@flowtrack/types';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class UserDataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  data: UserDataDto;

  @IsNotEmpty()
  logEvent: LogEvent;
}
