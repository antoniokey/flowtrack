import { IsEmail, IsNotEmpty } from 'class-validator';

class UserDataDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  data: UserDataDto;
}
