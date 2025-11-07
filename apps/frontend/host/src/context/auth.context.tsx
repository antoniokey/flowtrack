import { createContext } from 'react';

export interface IAuthContext {
  isLoggedIn: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);
