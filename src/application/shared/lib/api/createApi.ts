import { Api, ApiContext } from './types';

/**
 * Creates a function which is easy to use with useApi
 */
export const createApi = <Params, Result>(handler: Api<Params, Result>) => {
  return (params: Params, ctx: ApiContext) => handler(params, ctx);
};
