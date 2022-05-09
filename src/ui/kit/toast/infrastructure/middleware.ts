import { AnyAction, Dispatch, MiddlewareAPI, Middleware } from 'redux';
import { ToastController } from './controller';
import { showToast, showToastActionType } from './action';

export function createToastsMiddleware(
  toastController: ToastController,
): Middleware<Record<string, unknown>> {
  return (_: MiddlewareAPI<Dispatch>) => (next: Dispatch) => (action: AnyAction) => {
    if (action.type === showToastActionType) {
      const currentAction = action as ReturnType<typeof showToast>;

      toastController.addToast({
        body: currentAction.payload.body,
      });

      // We do not need to handle action in main reducer in production
      if (process.env.NODE_ENV === 'production') {
        return action;
      }

      return next(action);
    }
    return next(action);
  };
}
