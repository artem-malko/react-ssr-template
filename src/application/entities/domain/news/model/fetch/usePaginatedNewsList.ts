import { useAppQuery } from 'application/shared/hooks/useAppQuery';
import { useApi } from 'application/shared/lib/api';

import { getNewsListApi } from '../../api/getNewsList';
import { newsQueryKeys } from '../common';

export type UsePaginatedNewsParams = {
  page: number;
};

export const usePaginatedNewsList = (params: UsePaginatedNewsParams) => {
  const getNewsList = useApi(getNewsListApi);

  return useAppQuery(newsQueryKeys.paginatedListByParams(params), async () => {
    // A simple fake latency for the requests from server side
    await new Promise((resolve) => setTimeout(resolve, params.page % 2 ? 4000 : 0));

    return getNewsList({ page: params.page });
  });
};
