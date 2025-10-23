import React, { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import Modal from '@flowtrack/ui/components/Modal/Modal';

import i18n from '../i18n';

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
      <div>
        <h1>{t('welcome_title')}</h1>

        <div>
          <button onClick={() => setIsLoginModalOpened(true)}>{t('login.button')}</button>
          <div>
            <span>{t('register.note')}</span>
            <button onClick={() => setIsRegisterModalOpened(true)}>{t('register.button')}</button>
          </div>
        </div>

        {isLoginModalOpened && (
          <Modal
            title={t('login.modal.title')}
            onSubmit={() => {}}
            onClose={() => setIsLoginModalOpened(false)}
          >
            <></>
          </Modal>
        )}
        {isRegisterModalOpened && (
          <Modal
            title={t('register.modal.title')}
            onSubmit={() => {}}
            onClose={() => setIsRegisterModalOpened(false)}
          >
            <></>
          </Modal>
        )}
      </div>
    </I18nextProvider>
  );
}
