import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { createNavigator } from './navigate';
import { AnyAppState, Routes, AnyPage } from '../types';
import { createURLCompiler } from '../compileURL';

export function createNavigationMiddleware<PageName extends string>(
  routes: Routes<AnyPage<PageName>>,
): Middleware<Record<string, unknown>, AnyAppState, Dispatch> {
  const compileURL = createURLCompiler(routes);
  const navigate = createNavigator(compileURL);

  return (middlewareAPI: MiddlewareAPI<Dispatch, AnyAppState>) =>
    (next: Dispatch) =>
    (action: AnyAction) => {
      // To prevent calling navigate function in tests
      if (process.env.NODE_ENV === 'test') {
        return next(action);
      }

      if (navigate(action, middlewareAPI)) {
        return action;
      }

      return next(action);
    };
}
