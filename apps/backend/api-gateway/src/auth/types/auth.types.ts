import {
  LoginUserResponseDto,
  LoginUserBadRequestDto,
  CreateUserBadRequestDto,
  CreateUserResponseDto,
} from '../dto/auth.dto';

export type LoginUserResponse = LoginUserResponseDto | LoginUserBadRequestDto;

export type CreateUserResponse =
  | CreateUserResponseDto
  | CreateUserBadRequestDto;
