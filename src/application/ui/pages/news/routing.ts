import { RouteWithoutParams } from 'framework/infrastructure/router/types';
import { parsePageQueryParam } from 'application/ui/utils/routing/parsePageQueryParam';
import { NewsPage } from '.';
import { AppRoute } from 'application/main/routing';

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
