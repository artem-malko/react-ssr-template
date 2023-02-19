import { useInvalidateQuery } from 'lib/hooks/useInvalidateQuery';

import { userQueryKeys } from '../common';

export const useInvalidateAllUserQueries = () => {
  const invalidateQuery = useInvalidateQuery();

  return () =>
    invalidateQuery({
      queryKey: userQueryKeys.all(),
    });
};
