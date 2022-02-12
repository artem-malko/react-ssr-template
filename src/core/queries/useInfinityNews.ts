import { useInfiniteAppQuery } from 'infrastructure/query/useInfiniteAppQuery';

export const useInfinityNews = (initialPage = 1) => {
  const news = useInfiniteAppQuery(
    ['infinity_news'],
    async ({ services, context: { pageParam = initialPage } }) => {
      // Simple fake latency for the requests from server side
      // await new Promise((resolve) => setTimeout(resolve, pageParam % 2 ? 4000 : 0));

      return services.hackerNews.getNews({ page: pageParam }).then((res) => {
        return res;
      });
    },
    {
      staleTime: Infinity,
      useErrorBoundary: false,
      getNextPageParam: (_, pages) => initialPage + pages.length,
    },
  );

  return news;
};
