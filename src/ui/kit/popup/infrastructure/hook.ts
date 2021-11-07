import { useContext } from 'react';
import { PopupControllerContext } from './context';

export const usePopup = () => {
  const popupController = useContext(PopupControllerContext);

  return {
    addPopup: popupController.addPopup,
    closeAllPopups: popupController.removeAll,
    closePopupById: popupController.removePopupById,
  };
};
