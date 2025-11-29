/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { AppProps } from 'next/app';
import { usePathname, useRouter } from 'next/navigation';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useUserStore } from '@flowtrack/store';

import { AuthContext } from '@/context/auth.context';
import MainLayout from '@/layout/Layout';

import i18n from '../i18n';

import '../styles/globals.scss';

const queryClient = new QueryClient();

function AppInner({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { setUser, user } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('/api/user').then((res) => res.json()),
    enabled: isClient && isLoggedIn && !user,
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
  }, [pathname, isClient]);

  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData]);

  if (!isClient) {
    return null;
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthContext.Provider value={{ isLoggedIn }}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthContext.Provider>
    </I18nextProvider>
  );
}

export default function App({ ...props }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner {...props} />
    </QueryClientProvider>
  );
}

