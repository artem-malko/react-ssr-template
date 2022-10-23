import {
  hashQueryKey,
  InvalidateOptions,
  InvalidateQueryFilters,
  QueryFunction,
  QueryKey,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { ParsedError } from 'framework/infrastructure/request/types';
import { useHydrateQuery } from './useHydrateQuery';
import { useEffect } from 'react';

export const useCommonAppQuery = <TResult, TError extends ParsedError>(
  key: QueryKey,
  queryFunction: QueryFunction<TResult, QueryKey>,
  options?: Omit<UseQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const queryClient = useQueryClient();
  const queryId = hashQueryKey(key);

  useHydrateQuery(queryId);

  /**
   * Reset cache for a query, if it is in a error state
   */
  useEffect(() => {
    return () => {
      const status = queryClient.getQueryState(key, { exact: true });

      if (status?.status === 'error') {
        queryClient.getQueryCache().find(key, { exact: true })?.reset();
      }
    };
    // We use queryId as compiled key here,
    // cause key is a new array every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, queryId]);

  return {
    queryResult: useQuery<TResult, TError>(key, queryFunction, options),
    refetchQuery: (params?: {
      refetchQueryFilters?: RefetchQueryFilters<TResult>;
      refetchQueryOptions?: RefetchOptions;
    }) =>
      queryClient.refetchQueries(
        key,
        params?.refetchQueryFilters || { exact: true },
        params?.refetchQueryOptions,
      ),
    invalidateQuery: (params?: {
      invalidateQueryFilters?: InvalidateQueryFilters<TResult>;
      invalidateOptions?: InvalidateOptions;
    }) =>
      queryClient.invalidateQueries(
        key,
        params?.invalidateQueryFilters || { exact: true },
        params?.invalidateOptions,
      ),
  };
};
