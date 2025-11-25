import { LoginResponse, User } from '@flowtrack/types';
import { ApiProperty } from '@nestjs/swagger';

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
  statusCode: number;

  @ApiProperty()
  message: string;
}
