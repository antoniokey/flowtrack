import { IsEmail, IsNotEmpty } from 'class-validator';

import { LogEvent } from '@flowtrack/types';

class DataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class FindOneByDto {
  @IsNotEmpty()
  data: DataDto;

  @IsNotEmpty()
  logEvent: LogEvent;
}
