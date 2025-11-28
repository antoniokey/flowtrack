export interface User {
  name: string;
  email: string;
  password: string;
}

export interface WithoutPasswordUser extends Omit<User, 'password'> { }
