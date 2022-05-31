import { openPageSignal } from 'core/signals/page';
import { Route, RouteWithoutParams } from 'infrastructure/router/types';
import { parsePageQueryParam } from 'ui/utils/routing/parsePageQueryParam';
import { NewsPage } from '.';

export const newsPageRoute: Route<RouteWithoutParams, NewsPage> = {
  path: '/news',
  signal: (_, queryParams) => {
    return openPageSignal({
      name: 'news',
      params: {
        page: parsePageQueryParam(queryParams),
        useInfinity: !!queryParams['useInfinity'],
      },
    });
  },
  matchPageToQueryParams: ({ page, useInfinity }) => {
    return {
      p: [page.toString()],
      useInfinity: useInfinity ? [''] : [],
    };
  },
};
