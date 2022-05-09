import { useInfiniteAppQuery } from 'infrastructure/query/useInfiniteAppQuery';

export const useInfinityNews = (initialPage = 1) => {
  const news = useInfiniteAppQuery(
    ['infinity_news'],
    async ({ services, context: { pageParam = initialPage } }) => {
      return services.hackerNews.getNews({ page: pageParam }).then((res) => {
        return res;
      });
    },
    {
      staleTime: Infinity,
      getNextPageParam: (_, pages) => initialPage + pages.length,
    },
  );

  return news;
};
