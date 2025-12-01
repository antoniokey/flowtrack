import React, { useContext } from 'react';

import { AuthContext, IAuthContext } from '@/context/auth.context';

import styles from './Layout.module.scss';
import LayoutHeader from './components/Header/Header';
import LayoutSidebar from './components/Sidebar/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoggedIn } = useContext(AuthContext) as IAuthContext;

  return (
    <>
      {
        isLoggedIn
          ? (
            <div className={styles.layout}>
              <LayoutHeader />
              <LayoutSidebar />
              <div className={styles.layoutContent}>
                {children}
              </div>
            </div>
          )
          : children
      }
    </>
  );
}
