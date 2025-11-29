/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { AppProps } from 'next/app';
import { usePathname, useRouter } from 'next/navigation';

import { AuthContext } from '@/context/auth.context';
import MainLayout from '@/layout/Layout';

import i18n from '../i18n';

import '../styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const isLoggedIn = !!localStorage.getItem('isLoggedId');

    setIsLoggedIn(!!isLoggedIn);

    if (isLoggedIn) {
      router.replace('/dashboard');
    } else if (!isLoggedIn) {
      router.replace('/');
    }
  }, [pathname, isClient]);

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
