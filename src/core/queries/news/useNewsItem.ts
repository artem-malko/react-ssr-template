import { FetchNewsItemResponse } from 'core/services/hackerNews/types';
import { useAppQuery } from 'infrastructure/query/useAppQuery';

export const useNewsItem = (newsItemId: number, initialData?: FetchNewsItemResponse) => {
  const newsItem = useAppQuery(
    ['newsItem', newsItemId],
    async ({ services }) => {
      return services.hackerNews.getNewsItem({ id: newsItemId });
    },
    {
      staleTime: Infinity,
      initialData,
    },
  );

  return newsItem;
};
