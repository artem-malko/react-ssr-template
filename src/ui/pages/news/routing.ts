import { openPageSignal } from 'core/signals/page';
import { Route, RouteWithoutParams, URLQueryParams } from 'infrastructure/router/types';
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

function parsePageQueryParam(queryParams: URLQueryParams): number {
  const rawPageQueryParam = queryParams['p'];

  if (!rawPageQueryParam || !rawPageQueryParam.length || !rawPageQueryParam[0]) {
    return 1;
  }

  const parsedPage = parseInt(rawPageQueryParam[0], 10);

  return Number.isNaN(parsedPage) ? 1 : parsedPage <= 0 ? 1 : parsedPage;
}
