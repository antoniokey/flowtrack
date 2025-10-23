import React, { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import Modal from '@flowtrack/ui/components/Modal/Modal';
import Button from '@flowtrack/ui/components/Button/Button';

import i18n from '../i18n';
import { ButtonSize, ButtonType } from '../../../../../packages/ui/src/components/Button/constants';

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
          <Button
            type={ButtonType.Primary}
            size={ButtonSize.Medium}
            onClick={() => setIsLoginModalOpened(true)}
          >
            {t('login.button')}
          </Button>
          <div>
            <span>{t('register.note')}</span>
            <Button
              type={ButtonType.Primary}
              size={ButtonSize.Medium}
              onClick={() => setIsRegisterModalOpened(true)}
            >
              {t('register.button')}
            </Button>
          </div>
        </div>

        {isLoginModalOpened && (
          <Modal onClose={() => setIsLoginModalOpened(false)}>
            <Modal.Header>{t('login.modal.title')}</Modal.Header>
            <Modal.Body><></></Modal.Body>
            <Modal.Footer>
              <Button
                type={ButtonType.Primary}
                size={ButtonSize.Medium}
                onClick={() => {}}
              >
                {t('common.submit_button')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {isRegisterModalOpened && (
          <Modal onClose={() => setIsRegisterModalOpened(false)}>
            <Modal.Header>{t('register.modal.title')}</Modal.Header>
            <Modal.Body><></></Modal.Body>
            <Modal.Footer>
              <Button
                type={ButtonType.Primary}
                size={ButtonSize.Medium}
                onClick={() => {}}
              >
                {t('common.submit_button')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </I18nextProvider>
  );
}
