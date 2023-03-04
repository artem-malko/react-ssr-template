import { QueryClient } from '@tanstack/react-query';

import { AnyPage, URLQueryParams } from 'framework/public/types';

export type GetTitle<Page extends AnyPage<string>> = (params: {
  queryClient: QueryClient;
  page: Page;
  URLQueryParams: URLQueryParams;
}) => string;
