import { createContext } from 'react';

export interface ModalContextData {
  onClose?: () => void;
}

export const ModalContext = createContext<ModalContextData>({});
