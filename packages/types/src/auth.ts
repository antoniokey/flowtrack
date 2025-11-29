import { User } from './user';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface CreateUserResponse extends Omit<User, 'password'> { }
