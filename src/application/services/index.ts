import { AppLogger } from 'framework/infrastructure/logger';
import { Requester } from 'framework/infrastructure/request/types';

import { createFakeAPIService } from './fake';
import { createHackerNewsService } from './hackerNews';

type CreateServicesConfig = {
  hackerNewsApiUrl: string;
  fakeCrudApi: string;
};
type CreateServicesParams = {
  request: Requester;
  config: CreateServicesConfig;
  appLogger: AppLogger;
};
/* istanbul ignore next */
export const createServices = ({ request, config, appLogger }: CreateServicesParams) => {
  return {
    hackerNews: createHackerNewsService({
      request,
      config: {
        apiURL: config.hackerNewsApiUrl,
      },
      appLogger,
    }),
    fakeAPI: createFakeAPIService({
      request,
      config: {
        apiURL: config.fakeCrudApi,
      },
      appLogger,
    }),
  };
};

export type Services = ReturnType<typeof createServices>;
