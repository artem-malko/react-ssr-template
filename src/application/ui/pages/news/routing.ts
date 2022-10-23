
import { AppRoute } from 'application/main/routing';
import { parsePageQueryParam } from 'application/ui/utils/routing/parsePageQueryParam';
import { RouteWithoutParams } from 'framework/infrastructure/router/types';

import { NewsPage } from '.';

export const newsPageRoute: AppRoute<RouteWithoutParams, NewsPage> = {
  path: '/news',
  mapURLToPage: (_, queryParams) => ({
    name: 'news',
    params: {
      page: parsePageQueryParam(queryParams),
      useInfinity: !!queryParams['useInfinity'],
    },
  }),
  mapPageToQueryParams: ({ page, useInfinity }) => {
    return {
      p: [page.toString()],
      useInfinity: useInfinity ? [''] : [],
    };
  },
};
