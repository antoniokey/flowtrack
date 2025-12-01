/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { AppProps } from 'next/app';
import { usePathname, useRouter } from 'next/navigation';

import { toast, ToastContainer } from 'react-toastify';

import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';

import { useUserStore } from '@flowtrack/store';

import { AuthContext } from '@/context/auth.context';
import MainLayout from '@/layout/Layout';
import LogoutConfirmationModal from '@/layout/components/LogoutConfirmationModal/LogoutConfirmationModal';

import i18n from '../i18n';

import '../styles/globals.scss';

const queryClient = new QueryClient();

function AppInner({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutConfirmationModalOpened, setIsLogoutConfirmationModalOpened] = useState(false);

  const { setUser, removeUser, user } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('/api/user').then((res) => res.json()),
    enabled: isClient && isLoggedIn && !user,
  });

  const logutMutation = useMutation({
    mutationFn: () => fetch('/api/logout'),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const isLoggedIn = !!localStorage.getItem('isLoggedIn');

    setIsLoggedIn(!!isLoggedIn);

    if (isLoggedIn) {
      router.replace('/dashboard');
    } else if (!isLoggedIn) {
      router.replace('/');
    }
  }, [pathname, isClient, isLoggedIn]);

  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData]);

  useEffect(() => {
    const modalRoot = document.createElement('div');

    modalRoot.id = 'modal';

    document.body.appendChild(modalRoot);

    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

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

  if (!isClient) {
    return null;
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

