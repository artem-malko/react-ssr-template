import { createRoute } from 'application/main/routing/utils';
import { HttpErrorCode } from 'framework/types/http';

import { ErrorPage } from '.';

export const errorPageRoute = createRoute<ErrorPage, { code: string }>({
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
});
