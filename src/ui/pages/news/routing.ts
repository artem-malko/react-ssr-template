import { openPage } from 'core/actions/appContext/openPage';
import { Route, RouteWithoutParams, URLQueryParams } from 'infrastructure/router/types';
import { NewsPage } from '.';

export const newsPageRoute: Route<RouteWithoutParams, NewsPage> = {
  path: '/news',
  signal: (_, queryParams) => {
    return openPage({
      name: 'news',
      params: {
        page: parsePageQueryParam(queryParams),
      },
    });
  },
  matchPageToQueryParams: ({ page }) => {
    return {
      p: [page.toString()],
    };
  },
};

function parsePageQueryParam(queryParams: URLQueryParams): number {
  const rawPageQueryParam = queryParams['p'];

  if (!rawPageQueryParam || !rawPageQueryParam.length || !rawPageQueryParam[0]) {
    return 1;
  }

  const parsedPage = parseInt(rawPageQueryParam[0], 10);

  return Number.isNaN(parsedPage) ? 1 : parsedPage;
}
