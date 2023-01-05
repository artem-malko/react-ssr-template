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

import { AnyCommonFrameworkQueryOptions } from './types';
import { useHydrateQuery } from './useHydrateQuery';
import { useResetCacheOnUnmount } from './useResetCacheOnUnmount';

type Params<TResult, TError> = {
  key: QueryKey;
  queryFunction: QueryFunction<TResult, QueryKey>;
  queryOptions?: Omit<UseQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>;
  frameworkQueryOptions?: AnyCommonFrameworkQueryOptions;
};
/**
 * A tiny wrapper around useInfiniteQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useCommonAppQuery = <TResult, TError extends ParsedError>({
  key,
  queryFunction,
  queryOptions,
  frameworkQueryOptions,
}: Params<TResult, TError>) => {
  const queryClient = useQueryClient();
  const queryId = hashQueryKey(key);

  useHydrateQuery(queryId);
  useResetCacheOnUnmount({
    key,
    queryId,
    isErrorCodeOkToResetCacheCheck: frameworkQueryOptions?.isErrorCodeOkToResetCache,
  });

  return {
    queryResult: useQuery<TResult, TError>({
      ...queryOptions,
      queryKey: key,
      queryFn: queryFunction,
    }),
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
