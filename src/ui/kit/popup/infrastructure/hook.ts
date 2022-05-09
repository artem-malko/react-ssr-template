import { useCallback, useContext, useMemo } from 'react';
import { v4 } from 'uuid';
import { Popup } from '../types';
import { PopupControllerContext } from './context';

/**
 * Used to show/hide one concrete popup
 */
export const usePopup = (popupCreator: () => Omit<Popup, 'id'>, deps: any[]) => {
  const popupController = useContext(PopupControllerContext);

  /**
   * New id will be generated for every new popup, which gets new deps
   */
  const popupId = useMemo(() => {
    return v4();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  const showPopup = useCallback(() => {
    const popupParams = popupCreator();

    popupController.addPopup({
      ...popupParams,
      id: popupId,
    });

    return popupId;
    // The rule is disabled, cause of popupCreator
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupController, popupId]);

  return {
    showPopup,
  };
};

/**
 * A hook to work with any popup
 */
export const usePopupActions = () => {
  const popupController = useContext(PopupControllerContext);

  return {
    closeAllPopups: popupController.removeAll,
    closePopupById: popupController.removePopupById,
  };
};
