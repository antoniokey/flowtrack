/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { AppProps } from 'next/app';

import { toast, ToastContainer } from 'react-toastify';

import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';

import { useUserStore } from '@flowtrack/store';

import { AuthContext } from '@/context/auth.context';
import MainLayout from '@/layout/Layout';
import LogoutConfirmationModal from '@/layout/components/LogoutConfirmationModal/LogoutConfirmationModal';
import { useInitizlize } from '@/hooks/initialize';

import i18n from '../i18n';

import '../styles/globals.scss';

const queryClient = new QueryClient();

function AppInner({ Component, pageProps }: AppProps) {
  const { isClient, isLoggedIn, setIsLoggedIn } = useInitizlize();

  const [isLogoutConfirmationModalOpened, setIsLogoutConfirmationModalOpened] = useState(false);

  const { setUser, removeUser, user } = useUserStore();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('/api/user').then((res) => res.json()),
    enabled: isClient && isLoggedIn && !user,
  });

  const logutMutation = useMutation({
    mutationFn: () => fetch('/api/logout'),
  });

  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData]);

  if (!isClient) {
    return null;
  };

  const logout = () => {
    logutMutation.mutate(undefined, {
      onSuccess: () => {
        setIsLogoutConfirmationModalOpened(false);
        setIsLoggedIn(false);

        removeUser();

        localStorage.removeItem('isLoggedIn');
      },
      onError: (error) => toast(error.message, { type: 'error' }),
    })
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, setIsLogoutConfirmationModalOpened }}>
      <MainLayout>
        <Component {...pageProps} />

        {isLogoutConfirmationModalOpened && (
          <LogoutConfirmationModal
            onClose={() => setIsLogoutConfirmationModalOpened(false)}
          />
        )}

        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
      </MainLayout>
    </AuthContext.Provider>
  );
}

export default function App({ ...props }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AppInner {...props} />
      </I18nextProvider>
    </QueryClientProvider>
  );
}

