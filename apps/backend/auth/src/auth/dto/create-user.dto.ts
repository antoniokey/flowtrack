import { IsEmail, IsNotEmpty } from 'class-validator';

class UserDataDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  data: UserDataDto;
}
