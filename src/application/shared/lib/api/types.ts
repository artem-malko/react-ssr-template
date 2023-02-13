import { ApplicationConfig } from 'application/shared/config/types';
import { Requester, AppLogger } from 'framework/public/types';

export type Api<Params, Result> = (params: Params, ctx: ApiContext) => Promise<Result>;

/**
 * All useful things for any API
 */
export type ApiContext = {
  config: ApplicationConfig;
  logger: AppLogger;
  request: Requester;
};
