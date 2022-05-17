import { useInfiniteAppQuery } from 'infrastructure/query/useInfiniteAppQuery';

export const useInfinityNews = (initialPage = 1) => {
  return useInfiniteAppQuery(
    ['infinity_news'],
    async ({ services, context: { pageParam = initialPage } }) => {
      return services.hackerNews.getNews({ page: pageParam });
    },
    {
      staleTime: Infinity,
      getNextPageParam: (_, pages) => initialPage + pages.length,
    },
  );
};
