import { createRoute } from 'application/main/routing/utils';

import { ErrorPage } from '.';

export const errorPageRoute = createRoute<ErrorPage, { code: string }>({
  path: '/error/:code',
  mapURLParamsToPage: ({ code }) => ({
    name: 'error',
    params: {
      code: parseInt(code, 10),
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
