import { IsEmail, IsNotEmpty } from 'class-validator';

import { LogEvent } from '@flowtrack/types';

class DataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}

export class CreateOneDto {
  @IsNotEmpty()
  data: DataDto;

  @IsNotEmpty()
  logEvent: LogEvent;
}
