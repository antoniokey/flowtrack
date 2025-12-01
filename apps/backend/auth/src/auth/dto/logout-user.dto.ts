import { LogEvent } from '@flowtrack/types';

import { IsNotEmpty, IsNumber } from 'class-validator';

class UserDataDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class LogoutUserDto {
  @IsNotEmpty()
  data: UserDataDto;

  @IsNotEmpty()
  logEvent: LogEvent;
}
