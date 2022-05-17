import { Services } from 'core/services';
import { QueryFunctionContext, QueryKey, QueryFunction } from 'react-query';

export type AppQueryFunction<T = unknown, TQueryKey extends QueryKey = QueryKey> = (params: {
  services: Services;
  context: QueryFunctionContext<TQueryKey>;
}) => ReturnType<QueryFunction<T, TQueryKey>>;
