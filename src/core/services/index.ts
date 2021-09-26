import { Requester } from 'infrastructure/request/types';
import { createHackerNewsService } from './hackerNews';

interface CreateServicesConfig {
  hackerNewsAPIURL: string;
}
/* istanbul ignore next */
export const createServices = (params: { requester: Requester; config: CreateServicesConfig }) => {
  const { requester, config } = params;
  return {
    hackerNews: createHackerNewsService(requester, {
      apiURL: config.hackerNewsAPIURL,
    }),
  };
};

export type Services = ReturnType<typeof createServices>;
