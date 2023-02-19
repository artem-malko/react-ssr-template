import { QueryFunction, UseInfiniteQueryOptions, QueryKey } from '@tanstack/react-query';

import type { ParsedError } from 'framework/public/types';
import { useInfiniteCommonAppQuery } from 'framework/public/universal';

/**
 * Just a wrapper around useInfiniteAppQuery, which binds TError type
 */
export const useInfiniteAppQuery = <
  TResult,
  TError extends ParsedError,
  QKey extends QueryKey = QueryKey,
>(
  key: QKey,
  queryFunction: QueryFunction<TResult, QKey>,
  queryOptions?: Omit<UseInfiniteQueryOptions<TResult, TError, QKey>, 'queryKey' | 'queryFn'>,
) =>
  useInfiniteCommonAppQuery({
    key,
    queryFunction,
    queryOptions,
  });
