import { URLQueryParams } from 'framework/infrastructure/router/types';

export function parsePageQueryParam(queryParams: URLQueryParams): number {
  const rawPageQueryParam = queryParams['p'];

  if (!rawPageQueryParam || !rawPageQueryParam.length || !rawPageQueryParam[0]) {
    return 1;
  }

  const parsedPage = parseInt(rawPageQueryParam[0], 10);

  return Number.isNaN(parsedPage) ? 1 : parsedPage <= 0 ? 1 : parsedPage;
}
