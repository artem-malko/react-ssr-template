import { useInfiniteAppQuery } from 'infrastructure/query/useInfiniteAppQuery';

type UseInfinityNewsParams = {
  initialPage: number;
};
export const createUseInfinityNewsKey = () => {
  return ['infinity_news'];
};
export const useInfinityNews = (params: UseInfinityNewsParams) => {
  return useInfiniteAppQuery(
    createUseInfinityNewsKey(),
    async ({ services, context: { pageParam = params.initialPage } }) => {
      return services.hackerNews.getNews({ page: pageParam });
    },
    {
      staleTime: Infinity,
      getNextPageParam: (_, pages) => params.initialPage + pages.length,
    },
  );
};
