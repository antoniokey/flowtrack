import { createContext } from 'react';

export interface IAuthContext {
  isLoggedIn: boolean;
  logout: () => void;
  setIsLogoutConfirmationModalOpened: (flag: boolean) => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
