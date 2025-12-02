import { LogEvent } from '@flowtrack/types';

import { IsNotEmpty, IsString } from 'class-validator';

class UserDataDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  data: UserDataDto;

  @IsNotEmpty()
  logEvent: LogEvent;
}
