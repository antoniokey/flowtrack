import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '@flowtrack/ui/components/Modal/Modal';
import Button from '@flowtrack/ui/components/Button/Button';

import { useAuth } from '@/hooks/auth';

import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../../packages/ui/src/components/Button/constants';
import styles from './LogoutConfirmationModal.module.scss';

interface LogoutConfirmationModalProps {
  onClose: () => void;
}

const LogoutConfirmationModal = ({ onClose }: LogoutConfirmationModalProps) => {
  const { t } = useTranslation();

  const { logout } = useAuth();

  return (
    <Modal onClose={onClose}>
      <Modal.Header>{t('logout.modal.title')}</Modal.Header>
      <Modal.Body classNames={{ modalBody: styles.modalBody }}>
        {t('logout.modal.confirmation_text')}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          type={ButtonType.Submit}
          onClick={logout}
        >
          {t('buttons.logout')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutConfirmationModal;
