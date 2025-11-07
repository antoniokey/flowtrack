import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import { useUserStore } from '@flowtrack/store';
import Button from '@flowtrack/ui/components/Button/Button';

import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../../packages/ui/src/components/Button/constants';

import styles from './Header.module.scss';

const LayoutHeader = () => {
  const { t } = useTranslation();

  const { removeUser } = useUserStore();

  const router = useRouter();

  return (
    <div className={styles.layoutHeader}>
      <Button
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Medium}
        type={ButtonType.Submit}
        className={styles.logoutButton}
        onClick={() => {
          localStorage.removeItem('access_token');

          removeUser();

          router.push('/');
        }}
      >
        {t('header.logout_button')}
      </Button>
    </div>
  );
};

export default LayoutHeader;
