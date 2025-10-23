import React from 'react';
import ReactDOM from 'react-dom';

import styles from './Modal.module.scss';
import { ModalContext } from './context';
import { useModal } from './hooks';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  const modalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <ModalContext.Provider value={{ onClose }}>
            {children}
          </ModalContext.Provider>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal') as HTMLElement,
  );
};

const ModalHeader = ({ children }: Omit<ModalProps, 'onClose'>) => {
  const { onClose } = useModal();

  return (
    <div className={styles.modalHeader}>
      <span className={styles.title}>{children}</span>
      <span className={styles.closeIcon} onClick={onClose}>X</span>
    </div>
  );
};

const ModalBody = ({ children }: Omit<ModalProps, 'onClose'>) => (
  <div className={styles.modalBody}>
    {children}
  </div>
);

const ModalFooter = ({ children }: Omit<ModalProps, 'onClose'>) => (
  <div className={styles.modalFooter}>
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
