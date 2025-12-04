import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import Button from '@flowtrack/ui/components/Button/Button';

import { AuthContext, IAuthContext } from '@/context/auth.context';

import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../../packages/ui/src/components/Button/constants';
import styles from './Header.module.scss';

interface Props {
  isSidebarOpened: boolean;
}

const LayoutHeader = ({ isSidebarOpened }: Props) => {
  const { t } = useTranslation();

  const { setIsLogoutConfirmationModalOpened } = useContext(AuthContext) as IAuthContext;

  return (
    <div className={clsx(styles.layoutHeader, { [styles.sidebarClosedHeader]: !isSidebarOpened })}>
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
