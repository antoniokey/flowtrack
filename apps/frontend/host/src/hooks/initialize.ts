/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';

export const useInitizlize = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const isLoggedIn = !!localStorage.getItem('isLoggedIn');

    setIsLoggedIn(!!isLoggedIn);

    if (isLoggedIn) {
      router.replace('/dashboard');
    } else if (!isLoggedIn) {
      router.replace('/');
    }
  }, [pathname, isClient, isLoggedIn]);

  useEffect(() => {
    const modalRoot = document.createElement('div');

    modalRoot.id = 'modal';

    document.body.appendChild(modalRoot);

    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

  return { isClient, isLoggedIn, setIsLoggedIn };
};
