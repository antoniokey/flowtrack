import React from 'react';

import { useAuth } from '@/hooks/auth';

import styles from './Layout.module.scss';
import LayoutHeader from './components/Header/Header';
import LayoutSidebar from './components/Sidebar/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoggedIn } = useAuth();

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
