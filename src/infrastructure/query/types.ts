import { Services } from 'core/services';
import { AnyServiceParsedError } from 'infrastructure/request/types';
import { QueryFunctionContext, QueryKey, QueryFunction, UseQueryResult } from '@tanstack/react-query';

export type AppQueryFunction<T = unknown, TQueryKey extends QueryKey = QueryKey> = (params: {
  services: Services;
  context: QueryFunctionContext<TQueryKey>;
}) => ReturnType<QueryFunction<T, TQueryKey>>;

export type QueryDataResult<
  T extends (params: any) => { queryResult: UseQueryResult<any, AnyServiceParsedError> },
> = NonNullable<ReturnType<T>['queryResult']['data']>;
