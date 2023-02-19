import { useRefetchQuery } from 'lib/hooks/useRefetchQuery';

import { newsQueryKeys } from '../common';

export const useRefetchAllNewsQueries = () => {
  const refetchQuery = useRefetchQuery();

  return () =>
    refetchQuery({
      queryKey: newsQueryKeys.all(),
    });
};
