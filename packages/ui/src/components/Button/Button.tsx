import React from 'react';
import clsx from 'clsx';

import styles from './Button.module.scss';
import { ButtonSize, ButtonType } from './constants';

interface ButtonProps {
  children: string;
  type: ButtonType;
  size: ButtonSize;
  onClick: () => void;
}

const Button = ({
  children,
  type,
  size,
  onClick
}: ButtonProps) => {
  return (
    <button className={clsx(styles.button, styles[type], styles[size])} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default Button;
