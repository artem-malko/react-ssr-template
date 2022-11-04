import { createRoute } from 'application/main/routing/utils';
import { parsePageQueryParam } from 'application/ui/utils/routing/parsePageQueryParam';

import { NewsPage } from '.';

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
