import {
  QueryFunction,
  UseInfiniteQueryOptions,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';

import { useCommonAppQuery, useInfiniteCommonAppQuery } from 'framework/public/universal';

import type { ParsedError } from 'framework/public/types';

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
