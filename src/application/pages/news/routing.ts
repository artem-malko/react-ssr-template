import { parsePageQueryParam } from 'application/shared/lib/routing';

import { NewsPage } from '.';
import { createRouteConfig } from '../_internals';

export const newsPageRouteConfig = createRouteConfig<NewsPage>({
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
