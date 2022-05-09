import { openPageSignal } from 'core/signals/page';
import { HttpErrorCode } from 'core/types/http';
import { Route, RouteWithParams } from 'infrastructure/router/types';
import { ErrorPage } from '.';

export const errorPageRoute: Route<RouteWithParams<{ code: string }>, ErrorPage> = {
  path: '/error/:code',
  signal: ({ code }) => {
    return openPageSignal({
      name: 'error',
      params: {
        code: parseInt(code, 10) as HttpErrorCode,
      },
    });
  },
  matchPageToPathParams: ({ code }) => {
    return {
      code: code.toString(),
    };
  },
};
