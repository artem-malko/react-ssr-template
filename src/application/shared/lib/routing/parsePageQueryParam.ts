import type { URLQueryParams } from 'framework/public/types';

/**
 * queryParams can have string or string array as values
 * So, we need to parse a page number, to prevent of passing anything
 * which is not a corrent positive number
 */
export function parsePageQueryParam(queryParams: URLQueryParams): number {
  const rawPageQueryParam = queryParams['p'];

  if (!rawPageQueryParam || !rawPageQueryParam.length || !rawPageQueryParam[0]) {
    return 1;
  }

  const parsedPage = parseInt(rawPageQueryParam[0], 10);

  return Number.isNaN(parsedPage) ? 1 : parsedPage <= 0 ? 1 : parsedPage;
}
