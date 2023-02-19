import { useAppQuery } from 'application/shared/hooks/useAppQuery';
import { useApi } from 'application/shared/lib/api';

import { getNewsItemByIdApi } from '../../api/getNewsItemById';
import { NewsItem } from '../../types';
import { newsQueryKeys } from '../common';

export type UseNewsItemParams = {
  newsItemId: number;
  initialData?: NewsItem;
};
export const useNewsItemById = (params: UseNewsItemParams) => {
  const getNewsItemById = useApi(getNewsItemByIdApi);

  return useAppQuery(newsQueryKeys.byId(params), () => getNewsItemById({ id: params.newsItemId }), {
    staleTime: Infinity,
    initialData: params.initialData,
  });
};
