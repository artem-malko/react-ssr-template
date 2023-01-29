import {
  InvalidateOptions,
  InvalidateQueryFilters,
  QueryKey,
  RefetchOptions,
  RefetchQueryFilters,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (
      invalidateFilters: InvalidateQueryFilters & { queryKey: QueryKey },
      invalidateOptions?: InvalidateOptions,
    ) => {
      return queryClient.invalidateQueries(invalidateFilters, invalidateOptions);
    },
    [queryClient],
  );
};

export const useRefetchQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (refetchFilters: RefetchQueryFilters & { queryKey: QueryKey }, refetchOptions?: RefetchOptions) => {
      return queryClient.refetchQueries(refetchFilters, refetchOptions);
    },
    [queryClient],
  );
};
