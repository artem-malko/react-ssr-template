import { useInvalidateQuery } from 'lib/hooks/useInvalidateQuery';

import { userQueryKeys } from '../common';

export const useInvalidateAllLists = () => {
  const invalidateQuery = useInvalidateQuery();

  return () =>
    invalidateQuery({
      queryKey: userQueryKeys.all(),
    });
};
