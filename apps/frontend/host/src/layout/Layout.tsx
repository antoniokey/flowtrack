import React from 'react';

import styles from './Layout.module.scss';

import LayoutHeader from './components/Header/Header';
import LayoutSidebar from './components/Sidebar/Sidebar';
import { useAuth } from '@/hooks/auth';

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
              {children}
            </div>
          )
          : children
      }
    </>
  );
}
