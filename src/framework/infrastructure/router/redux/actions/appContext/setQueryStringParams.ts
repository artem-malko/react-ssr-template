import { URLQueryParams } from 'framework/infrastructure/router/types';

export const setQueryStringParamsAction = (payload: URLQueryParams) => ({
  type: 'setQueryStringParamsAction' as const,
  payload,
});

export type SetQueryStringParamsActionType = ReturnType<typeof setQueryStringParamsAction>;
