import { createActionConstructor } from 'core/actions/createActionConstructor';
import { Toast } from '../types';

export const showToastActionType = 'toasts_showToast';
export const showToast =
  createActionConstructor<Omit<Toast, 'id'>>(showToastActionType).createActionCreator();
