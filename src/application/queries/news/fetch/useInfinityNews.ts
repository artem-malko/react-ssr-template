import { useInfiniteAppQuery } from 'application/main/query';

import { newsQueryKeys } from '../common';

export type UseInfinityNewsParams = {
  initialPage: number;
};

export const useInfinityNews = (params: UseInfinityNewsParams) => {
  return useInfiniteAppQuery(
    newsQueryKeys.infinityListByParams(params),
    ({ services, context: { pageParam = params.initialPage } }) =>
      services.hackerNews.getNews({ page: pageParam }),
    {
      staleTime: Infinity,
      getNextPageParam: (_, pages) => params.initialPage + pages.length,
    },
  );
};
