import { openPage } from 'core/actions/appContext/openPage';
import { HttpCode } from 'core/shared/httpCode';
import { Route, RouteWithParams } from 'infrastructure/router/types';
import { ErrorPage } from '.';

export const errorPageRoute: Route<RouteWithParams<{ code: string }>, ErrorPage> = {
  path: '/error/:code',
  signal: ({ code }) => {
    return openPage({
      name: 'error',
      params: {
        code: parseInt(code, 10) as HttpCode,
      },
    });
  },
  matchPageToPathParams: ({ code }) => {
    return {
      code: code.toString(),
    };
  },
};
