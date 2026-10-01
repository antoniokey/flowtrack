import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@flowtrack/ui/components/Button/Button';

import { AuthContext, IAuthContext } from '@/context/auth.context';

import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../../packages/ui/src/components/Button/constants';
import styles from './Header.module.scss';

const LayoutHeader = () => {
  const { t } = useTranslation();

  const { setIsLogoutConfirmationModalOpened } = useContext(AuthContext) as IAuthContext;

  return (
    <div className={styles.layoutHeader}>
      <Button
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Medium}
        type={ButtonType.Submit}
        className={styles.logoutButton}
        onClick={() => setIsLogoutConfirmationModalOpened(true)}
      >
        {t('buttons.logout')}
      </Button>
    </div>
  );
};

export default LayoutHeader;
