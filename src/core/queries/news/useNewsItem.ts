import { FetchNewsItemResponse } from 'core/services/hackerNews/types';
import { useAppQuery } from 'infrastructure/query/useAppQuery';
import { useNewsQueryMainKey } from './common';

type UseNewsItemParams = {
  newsItemId: number;
  initialData?: FetchNewsItemResponse;
};
export const createUseNewsItemKey = (params: UseNewsItemParams) => {
  return [useNewsQueryMainKey, 'newsItem', params.newsItemId];
};
export const useNewsItem = (params: UseNewsItemParams) => {
  return useAppQuery(
    createUseNewsItemKey(params),
    async ({ services }) => {
      return services.hackerNews.getNewsItem({ id: params.newsItemId });
    },
    {
      staleTime: Infinity,
      initialData: params.initialData,
    },
  );
};
