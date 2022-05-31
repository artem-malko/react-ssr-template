import {
  InvalidateOptions,
  InvalidateQueryFilters,
  QueryKey,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { AnyServiceParsedError } from 'infrastructure/request/types';
import { AppQueryFunction } from './types';
import { useQueryEnhancer } from './useQueryEnhancer';
import { useEffect } from 'react';

/**
 * A tiny wrapper around useQuery
 * Purposes:
 * 1. Add an appliaction services to a queryFunction args
 * 2. dehydrate a query state on client side in case of a stream rendering
 *
 * @TODO may be change type of the error?
 * What if an Error will be thrown during response parse?
 */
export const useAppQuery = <TResult, TError extends AnyServiceParsedError>(
  key: QueryKey,
  queryFunction: AppQueryFunction<TResult, QueryKey>,
  options?: Omit<UseQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const queryClient = useQueryClient();
  const { queryFunctionWithServices, queryId } = useQueryEnhancer(key, queryFunction);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, queryId]);

  return {
    queryResult: useQuery<TResult, TError>(key, queryFunctionWithServices, options),
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
