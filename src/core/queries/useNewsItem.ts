import { FetchNewsItemResponse } from 'core/services/hackerNews/types';
import { useServices } from 'core/services/shared/context';
import { useQuery } from 'react-query';

export const useNewsItem = (newsItemId: number, initialData?: FetchNewsItemResponse) => {
  const services = useServices();
  const newsItem = useQuery<FetchNewsItemResponse>(
    ['newsItem', newsItemId],
    async () => {
      return services.hackerNews.getNewsItem({ id: newsItemId });
    },
    {
      staleTime: Infinity,
      initialData,
    },
  );

  return newsItem;
};
