import { QueryFunction, QueryKey, UseQueryOptions } from '@tanstack/react-query';

import type { ParsedError } from 'framework/public/types';
import { useCommonAppQuery } from 'framework/public/universal';

/**
 * Just a wrapper around useCommonAppQuery, which binds TError type
 */
export const useAppQuery = <TResult, TError extends ParsedError, QKey extends QueryKey>(
  key: QKey,
  queryFunction: QueryFunction<TResult, QKey>,
  queryOptions?: Omit<UseQueryOptions<TResult, TError, QKey>, 'queryKey' | 'queryFn'>,
) =>
  useCommonAppQuery({
    key,
    queryFunction,
    queryOptions,
  });
