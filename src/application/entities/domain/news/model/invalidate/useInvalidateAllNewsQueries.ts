import { useInvalidateQuery } from 'lib/hooks/useInvalidateQuery';

import { newsQueryKeys } from '../common';

export const useInvalidateAllNewsQueries = () => {
  const invalidateQuery = useInvalidateQuery();

  return () =>
    invalidateQuery({
      queryKey: newsQueryKeys.all(),
    });
};
