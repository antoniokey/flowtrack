import React, { useEffect, useState } from 'react';

import Modal from '@flowtrack/ui/components/Modal/Modal';

export default function LandingPage() {
  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);
  const [isRegisterModalOpened, setIsRegisterModalOpened] = useState(false);

  useEffect(() => {
    const modalRoot = document.createElement('div');
    
    modalRoot.id = 'modal';

    document.body.appendChild(modalRoot);

    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

  return (
    <div>
      <h1>Wecome to the flowtrack app</h1>

      <div>
        <button onClick={() => setIsLoginModalOpened(true)}>Login</button>
        <div>
          <span>Do not have an account?</span>
          <button onClick={() => setIsRegisterModalOpened(true)}>Create an account</button>
        </div>
      </div>

      {isLoginModalOpened && (
        <Modal title="login" onSubmit={() => {}} onClose={() => setIsLoginModalOpened(false)}>
          <></>
        </Modal>
      )}
      {isRegisterModalOpened && (
        <Modal title="Register" onSubmit={() => {}} onClose={() => setIsRegisterModalOpened(false)}>
          <></>
        </Modal>
      )}
    </div>
  );
}
