import { QueryKey, RefetchOptions, RefetchQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useRefetchQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (refetchFilters: RefetchQueryFilters & { queryKey: QueryKey }, refetchOptions?: RefetchOptions) => {
      return queryClient.refetchQueries(refetchFilters, refetchOptions);
    },
    [queryClient],
  );
};
