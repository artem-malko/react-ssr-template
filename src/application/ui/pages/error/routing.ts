import { createRoute } from 'application/main/routing/utils';
import { HttpErrorCode } from 'framework/types/http';

import { ErrorPage } from '.';

export const errorPageRoute = createRoute<ErrorPage, { code: string }>({
  path: '/error/:code',
  mapURLParamsToPage: ({ code }) => ({
    name: 'error',
    params: {
      code: parseInt(code, 10) as HttpErrorCode,
    },
  }),
  mapPageToURLParams: ({ code }) => {
    return {
      path: {
        code: code.toString(),
      },
    };
  },
});
