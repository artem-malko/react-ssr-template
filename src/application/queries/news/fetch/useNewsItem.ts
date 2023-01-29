import { useAppQuery } from 'application/main/query';
import { FetchNewsItemResponse } from 'application/services/hackerNews/types';

import { newsQueryKeys } from '../common';

export type UseNewsItemParams = {
  newsItemId: number;
  initialData?: FetchNewsItemResponse;
};
export const useNewsItem = (params: UseNewsItemParams) => {
  return useAppQuery(
    newsQueryKeys.byId(params),
    ({ services }) => services.hackerNews.getNewsItem({ id: params.newsItemId }),
    {
      staleTime: Infinity,
      initialData: params.initialData,
    },
  );
};
