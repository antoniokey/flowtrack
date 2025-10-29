import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { useMutation } from '@tanstack/react-query';

import useStore from '@flowtrack/store';

import Modal from '@flowtrack/ui/components/Modal/Modal';
import TextInputField from '@flowtrack/ui/components/TextInputField/TextInputField';
import Button from '@flowtrack/ui/components/Button/Button';

import styles from './LoginModal.module.scss';
import { ButtonSize, ButtonType, ButtonVariant } from '../../../../../../packages/ui/src/components/Button/constants';
import { TextInputFieldType } from '../../../../../../packages/ui/src/components/TextInputField/constants';
import { jwtDecode } from 'jwt-decode';

interface LoginModalProps {
  setIsLoginModalOpened: (flag: boolean) => void;
}

interface LoginModalFormFields {
  email: string;
  password: string;
}

const LoginModal = ({ setIsLoginModalOpened }: LoginModalProps) => {
  const { t } = useTranslation();

  const { setUser } = useStore();

  const mutation = useMutation({
    mutationFn: async (values: LoginModalFormFields) => {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        return res.json();
      } catch(error) {
        throw error;
      }
    },
  });

  const methods = useForm<LoginModalFormFields>({ mode: 'onChange' });

  const { handleSubmit } = methods;

  const onLoginSubmit = async (values: LoginModalFormFields) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem('access_token', data.access_token);

        setUser(jwtDecode(data.access_token));
      },
      onError: (error) => {
        console.error(error);
      },
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
