import { HttpErrorCode } from 'framework/types/http';
import { RouteWithParams } from 'framework/infrastructure/router/types';
import { ErrorPage } from '.';
import { AppRoute } from 'application/main/routing';

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
