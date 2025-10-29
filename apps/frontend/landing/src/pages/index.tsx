import React, { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Button from '@flowtrack/ui/components/Button/Button';

import LoginModal from '@/components/LoginModal/LoginModal';
import RegisterModal from '@/components/RegsiterModal/RegisterModal';

import styles from './index.module.scss';
import i18n from '../i18n';
import { ButtonSize, ButtonVariant } from '../../../../../packages/ui/src/components/Button/constants';

const client = new QueryClient();

export default function LandingPage() {
  const { t } = useTranslation();

  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);
  const [isRegisterModalOpened, setIsRegisterModalOpened] = useState(false);

  useEffect(() => {
    const modalRoot = document.createElement('div');

    modalRoot.id = 'modal';

    document.body.appendChild(modalRoot);

    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <div className={styles.landingPage}>
          <div className={styles.welcomeTitleContainer}>
            <h1 className={styles.welcomeTitle}>{t('welcome_title')}</h1>
            <Button
              className={styles.loginButton}
              variant={ButtonVariant.Primary}
              size={ButtonSize.Medium}
              onClick={() => setIsLoginModalOpened(true)}
            >
              {t('login.button')}
            </Button>
          </div>

          <div className={styles.registerButtonContainer}>
            <span>{t('register.note')}</span>
            <span
              className={styles.registerButton}
              onClick={() => setIsRegisterModalOpened(true)}
            >
              {t('register.button')}
            </span>
          </div>

          {isLoginModalOpened && (
            <LoginModal setIsLoginModalOpened={setIsLoginModalOpened} />
          )}
          {isRegisterModalOpened && (
            <RegisterModal setIsRegisterModalOpened={setIsRegisterModalOpened} />
          )}
        </div>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
