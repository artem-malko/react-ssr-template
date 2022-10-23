import { UseQueryResult } from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

export type QueryDataResult<
  T extends (params: any) => { queryResult: UseQueryResult<any, ParsedError> },
> = NonNullable<ReturnType<T>['queryResult']['data']>;
