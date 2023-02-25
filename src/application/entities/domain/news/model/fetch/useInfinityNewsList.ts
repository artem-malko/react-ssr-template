import { useInfiniteAppQuery } from 'application/shared/hooks/useInfiniteAppQuery';
import { useApi } from 'application/shared/lib/api';

import { getNewsListApi } from '../../api/getNewsList';
import { newsQueryKeys } from '../common';

export type UseInfinityNewsParams = {
  initialPage: number;
};

export const useInfinityNewsList = (params: UseInfinityNewsParams) => {
  const getNewsList = useApi(getNewsListApi);

  return useInfiniteAppQuery(
    newsQueryKeys.infinityListByParams(params),
    ({ pageParam = params.initialPage }) => getNewsList({ page: pageParam }),
    {
      staleTime: Infinity,
      getNextPageParam: (_, pages) => params.initialPage + pages.length,
    },
  );
};