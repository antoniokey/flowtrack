import React from 'react';
import { useFormContext } from 'react-hook-form';

import styles from './TextInputField.module.scss';
import { TextInputFieldType } from './constants';

interface TextInputFieldProps {
  name: string;
  label: string;
  type?: TextInputFieldType;
  validation?: Record<string, string | boolean | number>;
}

const TextInputField = ({ name, label, type = TextInputFieldType.Text, validation }: TextInputFieldProps) => {
  const { register, formState: { errors } } = useFormContext();

  const hasErrors = !!errors[name];

  return (
    <div className={styles.textInputField}>
      <label>{label}</label>
      <input
        className={styles.input}
        type={type}
        {...register(name, { ...validation })}
      />
      {
        hasErrors
          ? (
            <div className={styles.error}>
              {errors[name]?.message as string}
            </div>
          )
          : null
      }
    </div>
  );
}

export default TextInputField;
