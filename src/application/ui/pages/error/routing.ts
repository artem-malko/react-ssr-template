
import { AppRoute } from 'application/main/routing';
import { RouteWithParams } from 'framework/infrastructure/router/types';
import { HttpErrorCode } from 'framework/types/http';

import { ErrorPage } from '.';

export const errorPageRoute: AppRoute<RouteWithParams<{ code: string }>, ErrorPage> = {
  path: '/error/:code',
  mapURLToPage: ({ code }) => ({
    name: 'error',
    params: {
      code: parseInt(code, 10) as HttpErrorCode,
    },
  }),
  mapPageToPathParams: ({ code }) => {
    return {
      code: code.toString(),
    };
  },
};
