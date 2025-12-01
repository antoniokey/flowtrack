import { useEffect } from 'react';

export const useModalInit = () => {
  useEffect(() => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal';
    document.body.appendChild(modalRoot);

    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);
};
