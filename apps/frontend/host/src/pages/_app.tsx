import { I18nextProvider } from 'react-i18next';
import type { AppProps } from 'next/app';

import { ToastContainer } from 'react-toastify';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthContext } from '@/context/auth.context';
import MainLayout from '@/layout/Layout';
import LogoutConfirmationModal from '@/layout/components/LogoutConfirmationModal/LogoutConfirmationModal';
import { useAppInit } from '@/hooks/app-init';

import i18n from '../i18n';

import '../styles/globals.scss';
import { useModalInit } from '@/hooks/modal-init';
import { useAuthState } from '@/hooks/auth-state';

const queryClient = new QueryClient();

function AppInner({ Component, pageProps }: AppProps) {
  const { isClient, isLoggedIn, setIsLoggedIn } = useAppInit();
  const {
    logout,
    isLogoutConfirmationModalOpened,
    setIsLogoutConfirmationModalOpened,
  } = useAuthState({
    isClient,
    isLoggedIn,
    setIsLoggedIn,
  });

  useModalInit();

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

