import { Dispatch, Middleware, MiddlewareAPI, isAction } from 'redux';

import { createNavigator } from './navigate';
import { URLCompiler } from '../../compileURL';
import { AnyAppState } from '../../types';

export function createNavigationMiddleware(
  URLCompiler: URLCompiler,
): Middleware<Record<string, unknown>, AnyAppState, Dispatch> {
  const navigate = createNavigator(URLCompiler);

  return (middlewareAPI: MiddlewareAPI<Dispatch, AnyAppState>) => (next) => (action) => {
    // To prevent calling navigate function in tests
    if (process.env.NODE_ENV === 'test') {
      return next(action);
    }

    if (isAction(action) && navigate(action, middlewareAPI)) {
      return action;
    }

    return next(action);
  };
}
