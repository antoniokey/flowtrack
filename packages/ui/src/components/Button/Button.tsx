import React from 'react';
import clsx from 'clsx';

import styles from './Button.module.scss';
import { ButtonSize, ButtonType, ButtonVariant } from './constants';

interface ButtonProps {
  children: string;
  variant: ButtonVariant;
  size: ButtonSize;
  type?: ButtonType;
  className?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  variant,
  size,
  type = ButtonType.Button,
  className,
  onClick
}: ButtonProps) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], className)}
      type={type}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
