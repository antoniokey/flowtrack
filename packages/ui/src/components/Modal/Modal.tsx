import React from 'react';
import ReactDOM from 'react-dom';

import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { ButtonSize, ButtonType } from '../Button/constants';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onClose: () => void;
}

const Modal = ({ children, title, onSubmit, onClose }: ModalProps) => {
  const modalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <span className={styles.title}>{title}</span>
            <span className={styles.closeIcon} onClick={onClose}>X</span>
          </div>
          <div className={styles.modalBody}>
            {children}
          </div>
          <div className={styles.modalFooter}>
            <Button
              type={ButtonType.Primary}
              size={ButtonSize.Medium}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal') as HTMLElement,
  );
};

export default Modal;
