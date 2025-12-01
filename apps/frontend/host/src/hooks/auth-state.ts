/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useUserStore } from '@flowtrack/store';

interface Props {
  isClient: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
}

export function useAuthState({ isClient, isLoggedIn, setIsLoggedIn }: Props) {
  const [isLogoutConfirmationModalOpened, setIsLogoutConfirmationModalOpened] = useState(false);

  const { setUser, removeUser, user } = useUserStore();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('/api/user').then((res) => res.json()),
    enabled: isClient && isLoggedIn && !user,
  });

  const logoutMutation = useMutation({
    mutationFn: () => fetch('/api/logout'),
  });

  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData]);

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setIsLogoutConfirmationModalOpened(false);
        setIsLoggedIn(false);
        removeUser();

        localStorage.removeItem('isLoggedIn');
      },
      onError: (error: any) => toast(error.message, { type: 'error' }),
    });
  };

  return {
    user,
    logout,
    isLogoutConfirmationModalOpened,
    setIsLogoutConfirmationModalOpened,
  };
}
