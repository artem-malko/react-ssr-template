import { useAppSuspenseInfiniteQuery } from 'application/shared/hooks/useAppSuspenseInfiniteQuery';
import { useApi } from 'application/shared/lib/api';

import { getNewsListApi } from '../../api/getNewsList';
import { newsQueryKeys } from '../common';

export type UseInfinityNewsParams = {
  initialPage: number;
};

export const useInfinityNewsList = (params: UseInfinityNewsParams) => {
  const getNewsList = useApi(getNewsListApi);

  return useAppSuspenseInfiniteQuery({
    queryKey: newsQueryKeys.infinityListByParams(params),
    queryFn: ({ pageParam }) => getNewsList({ page: pageParam }),

    staleTime: Infinity,
    getNextPageParam: (_, pages) => params.initialPage + pages.length,
    initialPageParam: params.initialPage,
  });
};
