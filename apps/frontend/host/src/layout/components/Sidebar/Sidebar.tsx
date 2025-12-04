import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoHome } from 'react-icons/go';
import { TfiArrowCircleLeft } from 'react-icons/tfi';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import clsx from 'clsx';

import styles from './Sidebar.module.scss';
import { SIDEBAR_OPTIONS } from './constants';
import { SidebarOption } from './types';

interface Props {
  isSidebarOpened: boolean;
  setIsSidebarOpened: (isSidebarOpened: boolean) => void;
}

const LayoutSidebar = ({ isSidebarOpened, setIsSidebarOpened }: Props) => {
  const { t } = useTranslation();

  const pathname = usePathname();
  const router = useRouter();

  const onSidebarOptionClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, option: SidebarOption) => {
    event.preventDefault();

    if (pathname !== option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className={clsx(styles.layoutSidebar, {
      [styles.sidebarCollapsed]: !isSidebarOpened,
      [styles.sidebarOpened]: isSidebarOpened,
    })}>
      <TfiArrowCircleLeft
        className={clsx(styles.arrow, {
          [styles.arrowCollapsed]: !isSidebarOpened,
          [styles.arrowOpened]: isSidebarOpened,
        })}
        onClick={() => setIsSidebarOpened(!isSidebarOpened)} />

      <div className={styles.appInfo}>
        <Image
          src={isSidebarOpened ? '/images/logo.png' : '/images/logo-image.png'}
          alt='App logo'
          width={isSidebarOpened ? 200 : 90}
          height={isSidebarOpened ? 100 : 50}
          className={clsx(styles.logo, {
            [styles.sidebarClosedLogo]: !isSidebarOpened,
          })}
        />
      </div>

      <div className={clsx(styles.sidebarOptions, {
        [styles.sidebarClosedOptions]: !isSidebarOpened,
      })}>
        {SIDEBAR_OPTIONS.map(option => (
          <Link
            key={option.key}
            href={option.path}
            className={clsx(styles.sidebarOption, {
              [styles.activeSidebarOption]: pathname === option.path,
              [styles.sidebarClosedOption]: !isSidebarOpened,
            })}
            onClick={event => onSidebarOptionClick(event, option)}
          >
            <GoHome />
            {isSidebarOpened && (
              <span>{t(`sidebar_options.${option.key}`)}</span>
            )}
            <div className={styles.tooltip}>
              {t(`sidebar_options.${option.key}`)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LayoutSidebar;
