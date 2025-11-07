import { useContext } from 'react';

import { AuthContext, IAuthContext } from '@/context/auth.context';

export const useAuth = () => useContext(AuthContext) as IAuthContext;
