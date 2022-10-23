import {
  QueryFunction,
  UseInfiniteQueryOptions,
  QueryFunctionContext,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';
import { Services } from 'application/services';
import { useServices } from 'application/services/shared/context';
import { useCommonAppQuery } from 'framework/infrastructure/query/useCommonAppQuery';
import { useInfiniteCommonAppQuery } from 'framework/infrastructure/query/useInfiniteCommonAppQuery';
import { ParsedError } from 'framework/infrastructure/request/types';

export type AppQueryFunction<T = unknown, TQueryKey extends QueryKey = QueryKey> = (params: {
  services: Services;
  context: QueryFunctionContext<TQueryKey>;
}) => ReturnType<QueryFunction<T, TQueryKey>>;

export const useAppQuery = <TResult, TError extends ParsedError>(
  key: QueryKey,
  queryFunction: AppQueryFunction<TResult, QueryKey>,
  options?: Omit<UseQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const services = useServices();

  return useCommonAppQuery(
    key,
    (context: QueryFunctionContext<QueryKey>) =>
      queryFunction({
        context,
        services,
      }),
    options,
  );
};

export const useInfiniteAppQuery = <TResult, TError extends ParsedError>(
  key: QueryKey,
  queryFunction: AppQueryFunction<TResult, QueryKey>,
  options?: Omit<UseInfiniteQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const services = useServices();

  return useInfiniteCommonAppQuery(
    key,
    (context: QueryFunctionContext<QueryKey>) =>
      queryFunction({
        context,
        services,
      }),
    options,
  );
};
