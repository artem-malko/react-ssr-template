import { Requester } from 'infrastructure/request/types';
import { createFakeAPIService } from './fake';
import { createHackerNewsService } from './hackerNews';

interface CreateServicesConfig {
  hackerNewsAPIURL: string;
  fakeCRUDAPI: string;
}
/* istanbul ignore next */
export const createServices = (params: { requester: Requester; config: CreateServicesConfig }) => {
  const { requester, config } = params;
  return {
    hackerNews: createHackerNewsService(requester, {
      apiURL: config.hackerNewsAPIURL,
    }),
    fakeAPI: createFakeAPIService(requester, {
      apiURL: config.fakeCRUDAPI,
    }),
  };
};

export type Services = ReturnType<typeof createServices>;
