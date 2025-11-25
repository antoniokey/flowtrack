import { CreateUserResponse, User } from '@flowtrack/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements User {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class CreateUserResponseDto implements CreateUserResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class CreateUserBadRequestDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
