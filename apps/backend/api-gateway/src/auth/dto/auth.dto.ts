import { ApiProperty } from '@nestjs/swagger';

import { CreateUserResponse, LoginResponse, User } from '@flowtrack/types';

class ErrorDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class LoginUserDto implements Omit<User, 'name'> {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserResponseDto implements LoginResponse {
  @ApiProperty()
  access_token: string;
}

export class LoginUserBadRequestDto {
  @ApiProperty()
  error: ErrorDto;
}

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
  error: ErrorDto;
}
