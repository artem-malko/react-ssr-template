import { useAppSuspenseQuery } from 'application/shared/hooks/useAppSuspenseQuery';
import { useApi } from 'application/shared/lib/api';

import { getNewsListApi } from '../../api/getNewsList';
import { newsQueryKeys } from '../common';

export type UsePaginatedNewsParams = {
  page: number;
};

export const usePaginatedNewsList = (params: UsePaginatedNewsParams) => {
  const getNewsList = useApi(getNewsListApi);

  return useAppSuspenseQuery({
    queryKey: newsQueryKeys.paginatedListByParams(params),
    queryFn: async () => {
      // A simple fake latency for the requests from server side
      await new Promise((resolve) => setTimeout(resolve, params.page % 2 ? 4000 : 0));

      return getNewsList({ page: params.page });
    },
  });
};
