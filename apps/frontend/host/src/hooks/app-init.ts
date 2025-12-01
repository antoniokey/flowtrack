/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAppInit() {
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

    setIsLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      router.replace('/dashboard');
    } else {
      router.replace('/');
    }
  }, [pathname, isClient]);

  return { isClient, isLoggedIn, setIsLoggedIn };
}
