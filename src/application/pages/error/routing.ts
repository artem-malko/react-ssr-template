import { ErrorPage } from '.';
import { createRouteConfig } from '../_internals';

export const errorPageRouteConfig = createRouteConfig<ErrorPage, 'code'>({
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
