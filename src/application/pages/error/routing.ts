import { ErrorPage } from '.';
import { createRoute } from '../_internals/createRoute';

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
