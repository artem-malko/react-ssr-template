import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

import { URLCompiler } from '../../compileURL';
import { AnyAppState } from '../../types';
import { createNavigator } from './navigate';

export function createNavigationMiddleware(
  URLCompiler: URLCompiler,
): Middleware<Record<string, unknown>, AnyAppState, Dispatch> {
  const navigate = createNavigator(URLCompiler);

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
