import { QueryClient } from '@tanstack/react-query';

import { NewsItem } from '../../types';
import { newsQueryKeys } from '../common';

type Params = {
  queryClient: QueryClient;
  newsItemId: number;
};
/**
 * Get newsItem data from a query cache
 */
export function getNewsItemDataFromCache({ queryClient, newsItemId }: Params) {
  return queryClient.getQueryData<NewsItem>(
    newsQueryKeys.byId({
      newsItemId,
    }),
  );
}
