import { useAppQuery } from 'infrastructure/query/useAppQuery';

export const usePaginatedNews = (page = 1) => {
  return useAppQuery(
    ['paginated_news', page],
    async ({ services }) => {
      // Simple fake latency for the requests from server side
      await new Promise((resolve) => setTimeout(resolve, page % 2 ? 4000 : 0));

      return services.hackerNews.getNews({ page });
    },
    {
      staleTime: Infinity,
    },
  );
};
