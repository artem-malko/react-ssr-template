import { FetchNewsResponse } from 'core/services/hackerNews/types';
import { useServices } from 'core/services/shared/context';
import { useQuery } from 'react-query';
import { getInitialDataFromDom } from 'ui/components/initialData';

export const usePaginatedNews = (page = 1) => {
  const queryId = 'paginatedNews';
  const services = useServices();
  const news = useQuery<FetchNewsResponse>(
    ['news', page],
    async () => {
      // Simple fake latency for the requests from server side
      const timeout = process.env.APP_ENV === 'server' ? 4000 : 400;
      await new Promise((resolve) => setTimeout(resolve, timeout));

      return services.hackerNews.getNews({ page }).then((res) => {
        // @WIP just to reduce data to render
        return res.slice(0, 10);
      });
    },
    {
      staleTime: Infinity,
      initialData: () => getInitialDataFromDom(queryId),
    },
  );

  return { news, queryId };
};
