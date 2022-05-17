import { QueryKey, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { AnyServiceParsedError } from 'infrastructure/request/types';
import { AppQueryFunction } from './types';
import { useQueryEnhancer } from './useQueryEnhancer';

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
  const { queryFunctionWithServices } = useQueryEnhancer(key, queryFunction);

  return {
    queryResult: useQuery<TResult, TError>(key, queryFunctionWithServices, options),
    invalidateQuery: () => queryClient.invalidateQueries(key),
    refetchQuery: () => queryClient.refetchQueries(key),
    getQueryData: () => queryClient.getQueryData(key),
  };
};
