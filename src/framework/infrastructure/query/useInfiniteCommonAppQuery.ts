import {
  hashQueryKey,
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

import { useHydrateQuery } from './useHydrateQuery';

/**
 * A tiny wrapper around useInfiniteQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useInfiniteCommonAppQuery = <TResult, TError extends ParsedError>(
  key: QueryKey,
  queryFunction: QueryFunction<TResult, QueryKey>,
  options?: Omit<UseInfiniteQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const queryId = hashQueryKey(key);
  useHydrateQuery(queryId);

  return useInfiniteQuery<TResult, TError>(key, queryFunction, options);
};
