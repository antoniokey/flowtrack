import { ApiProperty } from '@nestjs/swagger';

import { CreateUserResponse, User } from '@flowtrack/types';

class ErrorDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class LoginUserDto implements Omit<User, 'name'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserResponseDto {
  @ApiProperty()
  ok: boolean;
}

export class LoginUserBadRequestDto {
  @ApiProperty()
  error: ErrorDto;
}

export class CreateUserDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class CreateUserResponseDto implements CreateUserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class CreateUserBadRequestDto {
  @ApiProperty()
  error: ErrorDto;
}

export class LogoutUserDtoResponse {
  @ApiProperty()
  ok: boolean;
}
