import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useMutation } from '@tanstack/react-query';

import Modal from '@flowtrack/ui/components/Modal/Modal';
import TextInputField from '@flowtrack/ui/components/TextInputField/TextInputField';
import Button from '@flowtrack/ui/components/Button/Button';

import styles from './RegisterModal.module.scss';
import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../packages/ui/src/components/Button/constants';
import { TextInputFieldType } from '../../../../../../packages/ui/src/components/TextInputField/constants';

interface RegisterModalProps {
  setIsRegisterModalOpened: (flag: boolean) => void;
  setIsLoginModalOpened: (flag: boolean) => void;
}

interface RegisterModalFormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterModal = ({ setIsRegisterModalOpened, setIsLoginModalOpened }: RegisterModalProps) => {
  const { t } = useTranslation();

  const registerMutation = useMutation({
    mutationFn: async (values: Omit<RegisterModalFormFields, 'confirmPassword'>) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    },
  });

  const methods = useForm<RegisterModalFormFields>();

  const { getValues, handleSubmit } = methods;

  const onRegisterSubmit = (values: RegisterModalFormFields) => {
    const { confirmPassword, ...createdUser } = values;

    registerMutation.mutate(createdUser, {
      onSuccess: () => {
        toast(t('register.success'), { type: 'success' });

        setIsRegisterModalOpened(false);
        setIsLoginModalOpened(true);
      },
      onError: (error) => toast(error.message, { type: 'error' }),
    });
  }

  return (
    <Modal onClose={() => setIsRegisterModalOpened(false)}>
      <FormProvider {...methods}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onRegisterSubmit)}
        >
          <Modal.Header>{t('register.modal.title')}</Modal.Header>
          <Modal.Body>
            <TextInputField
              name="name"
              label={t('fields.name')}
              validation={{ required: t('errors.required') }}
            />
            <TextInputField
              name="email"
              label={t('fields.email')}
              type={TextInputFieldType.Email}
              validation={{
                required: t('errors.required'),
                email: t('errors.email'),
              }}
            />
            <TextInputField
              name="password"
              label={t('fields.password')}
              type={TextInputFieldType.Password}
            />
            <TextInputField
              name="confirmPassword"
              label={t('fields.confirm_password')}
              type={TextInputFieldType.Password}
              validation={{
                validate: {
                  passwordMatch: (confirmPassword: string) => {
                    if (confirmPassword !== getValues('password')) {
                      return t('errors.confirm_password');
                    }

                    return true;
                  }
                } as any,
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Medium}
              type={ButtonType.Submit}
            >
              {t('buttons.submit')}
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
}

export default RegisterModal;
