import { createActionConstructor } from 'core/actions/createActionConstructor';
import { Popup } from '../types';

export const showPopupActionType = 'popup_showPopup';
export const showPopup = createActionConstructor<Popup>(showPopupActionType).createActionCreator();

export const hidePopupByIdActionType = 'popup_hidePopupByIdPopup';
export const hidePopupById =
  createActionConstructor<{ popupId: string }>(hidePopupByIdActionType).createActionCreator();

export const hideAllPopupsActionType = 'popup_hideAllPopups';
export const hideAllPopups = createActionConstructor(hideAllPopupsActionType).createActionCreator();
