import React from 'react';
import { useTranslation } from 'react-i18next';
import { GoHome } from "react-icons/go";

import styles from './Sidebar.module.scss';
import { SIDEBAR_OPTIONS } from './constants';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


const LayoutSidebar = () => {
  const { t } = useTranslation();

  const pathname = usePathname();

  return (
    <div className={styles.layoutSidebar}>
      <div className={styles.appInfo}>
        <Image src="/images/logo.png" alt="App logo" width={200} height={100} className={styles.logo} />
      </div>

      <div className={styles.sidebarOptions}>
        {SIDEBAR_OPTIONS.map(option => (
          <Link
            key={option.key}
            href={option.path}
            className={clsx(styles.sidebarOption, {
              [styles.activeSidebarOption]: pathname === option.path,
            })}
          >
            <GoHome />
            <span>{t(`sidebar_options.${option.key}`)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LayoutSidebar;
