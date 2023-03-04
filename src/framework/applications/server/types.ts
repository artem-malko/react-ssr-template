import { QueryClient } from '@tanstack/react-query';

import { AnyPage, URLQueryParams } from 'framework/public/types';
import { Metadata } from 'framework/types/metadata';

export type GetMetadata<Page extends AnyPage<string>> = (params: {
  queryClient: QueryClient;
  page: Page;
  URLQueryParams: URLQueryParams;
}) => Promise<Metadata>;
