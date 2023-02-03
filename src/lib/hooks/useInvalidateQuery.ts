import {
  InvalidateOptions,
  InvalidateQueryFilters,
  QueryKey,
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
