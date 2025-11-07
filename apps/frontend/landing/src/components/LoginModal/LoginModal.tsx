import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@flowtrack/store';
import Modal from '@flowtrack/ui/components/Modal/Modal';
import TextInputField from '@flowtrack/ui/components/TextInputField/TextInputField';
import Button from '@flowtrack/ui/components/Button/Button';
import { useFlowtrackRouter } from '@flowtrack/router';

import styles from './LoginModal.module.scss';
import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../packages/ui/src/components/Button/constants';
import { TextInputFieldType } from '../../../../../../packages/ui/src/components/TextInputField/constants';

interface LoginModalProps {
  setIsLoginModalOpened: (flag: boolean) => void;
}

interface LoginModalFormFields {
  email: string;
  password: string;
}

const LoginModal = ({ setIsLoginModalOpened }: LoginModalProps) => {
  const { t } = useTranslation();

  const router = useFlowtrackRouter(); 

  const { setUser } = useUserStore();

  const mutation = useMutation({
    mutationFn: async (values: LoginModalFormFields) => {
      const response = await fetch('/api/login', {
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

  const methods = useForm<LoginModalFormFields>({ mode: 'onChange' });

  const { handleSubmit } = methods;

  const onLoginSubmit = async (values: LoginModalFormFields) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem('access_token', data.access_token);

        setUser(jwtDecode(data.access_token));

        router.push('/dashboard');
        
        setIsLoginModalOpened(false);
      },
      onError: (error) => toast(error.message, { type: 'error' }),
    });
  }

  return (
    <Modal onClose={() => setIsLoginModalOpened(false)}>
      <FormProvider {...methods}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onLoginSubmit)}
        >
          <Modal.Header>{t('login.modal.title')}</Modal.Header>
          <Modal.Body>
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
              validation={{ required: t('errors.required') }}
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

export default LoginModal;
