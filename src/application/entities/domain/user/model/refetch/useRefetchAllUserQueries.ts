import { useRefetchQuery } from 'lib/hooks/useRefetchQuery';

import { userQueryKeys } from '../common';

export const useRefetchAllUserQueries = () => {
  const refetchQuery = useRefetchQuery();

  return () =>
    refetchQuery({
      queryKey: userQueryKeys.all(),
    });
};
