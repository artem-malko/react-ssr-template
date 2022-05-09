import { AnyAction, Dispatch, MiddlewareAPI, Middleware } from 'redux';
import { PopupController } from './controller';
import {
  hideAllPopupsActionType,
  hidePopupById,
  hidePopupByIdActionType,
  showPopup,
  showPopupActionType,
} from './action';
import { v4 } from 'uuid';

export function createPopupMiddleware(
  popupController: PopupController,
): Middleware<Record<string, unknown>> {
  return (_: MiddlewareAPI<Dispatch>) => (next: Dispatch) => (action: AnyAction) => {
    switch (action.type) {
      case showPopupActionType: {
        const currentAction = action as ReturnType<typeof showPopup>;

        popupController.addPopup({
          id: v4(),
          body: currentAction.payload.body,
          onClose: currentAction.payload.onClose,
        });
        break;
      }

      case hidePopupByIdActionType: {
        const currentAction = action as ReturnType<typeof hidePopupById>;

        popupController.removePopupById(currentAction.payload.popupId);
        break;
      }

      case hideAllPopupsActionType: {
        popupController.removeAll();
        break;
      }

      default:
        return next(action);
    }

    // We do not need to handle action in main reducer in production
    if (process.env.NODE_ENV === 'production') {
      return action;
    }

    return next(action);
  };
}
