import { Requester } from 'framework/infrastructure/request/types';
import { createFakeAPIService } from './fake';
import { createHackerNewsService } from './hackerNews';

interface CreateServicesConfig {
  hackerNewsApiUrl: string;
  fakeCrudApi: string;
}
/* istanbul ignore next */
export const createServices = (params: { requester: Requester; config: CreateServicesConfig }) => {
  const { requester, config } = params;
  return {
    hackerNews: createHackerNewsService(requester, {
      apiURL: config.hackerNewsApiUrl,
    }),
    fakeAPI: createFakeAPIService(requester, {
      apiURL: config.fakeCrudApi,
    }),
  };
};

export type Services = ReturnType<typeof createServices>;
