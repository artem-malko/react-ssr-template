import { parsePageQueryParam } from 'application/shared/lib/routing/parsePageQueryParam';

import { NewsPage } from '.';
import { createRoute } from '../_internals/createRoute';

export const newsPageRoute = createRoute<NewsPage>({
  path: '/news',
  mapURLParamsToPage: (_, queryParams) => ({
    name: 'news',
    params: {
      page: parsePageQueryParam(queryParams),
      useInfinity: !!queryParams['useInfinity'],
    },
  }),
  mapPageToURLParams: ({ page, useInfinity }) => {
    return {
      query: {
        p: [page.toString()],
        useInfinity: useInfinity ? [''] : [],
      },
    };
  },
});
