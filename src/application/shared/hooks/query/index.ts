import {
  QueryFunction,
  UseInfiniteQueryOptions,
  QueryFunctionContext,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';

import { Services } from 'application/shared/services';
import { useServices } from 'application/shared/services/shared/context';
import { useCommonAppQuery, useInfiniteCommonAppQuery } from 'framework/public/universal';

import type { ParsedError } from 'framework/public/types';

export type AppQueryFunction<T = unknown, TQueryKey extends QueryKey = QueryKey> = (params: {
  services: Services;
  context: QueryFunctionContext<TQueryKey>;
}) => ReturnType<QueryFunction<T, TQueryKey>>;

export const useAppQuery = <TResult, TError extends ParsedError, QKey extends QueryKey>(
  key: QKey,
  queryFunction: AppQueryFunction<TResult, QKey>,
  options?: Omit<UseQueryOptions<TResult, TError, QKey>, 'queryKey' | 'queryFn'>,
) => {
  const services = useServices();

  return useCommonAppQuery({
    key,
    queryFunction: (context: QueryFunctionContext<QKey>) =>
      queryFunction({
        context,
        services,
      }),
    queryOptions: options,
  });
};

export const useInfiniteAppQuery = <
  TResult,
  TError extends ParsedError,
  QKey extends QueryKey = QueryKey,
>(
  key: QKey,
  queryFunction: AppQueryFunction<TResult, QKey>,
  options?: Omit<UseInfiniteQueryOptions<TResult, TError, QKey>, 'queryKey' | 'queryFn'>,
) => {
  const services = useServices();

  return useInfiniteCommonAppQuery({
    key,
    queryFunction: (context: QueryFunctionContext<QKey>) =>
      queryFunction({
        context,
        services,
      }),
    queryOptions: options,
  });
};
