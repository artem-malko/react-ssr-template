import { useContext } from 'react';

import { ToastControllerContext } from './context';

export const useToast = () => {
  const toastController = useContext(ToastControllerContext);

  return {
    showToast: toastController.addToast,
  };
};
