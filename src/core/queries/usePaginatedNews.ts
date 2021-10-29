import { useAppQuery } from 'infrastructure/query/useAppQuery';

export const usePaginatedNews = (page = 1) => {
  const news = useAppQuery(
    ['news', page],
    async ({ services }) => {
      // Simple fake latency for the requests from server side
      await new Promise((resolve) => setTimeout(resolve, page % 2 ? 4000 : 1000));

      return services.hackerNews.getNews({ page }).then((res) => {
        return res;
      });
    },
    {
      staleTime: 0,
      useErrorBoundary: false,
    },
  );

  return news;
};
