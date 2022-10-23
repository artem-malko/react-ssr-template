import { ApplicationConfig } from '../types';

export const defaultApplicationConfig: ApplicationConfig = {
  networkTimeout: 10000,
  publicPath: '/public/',

  hackerNewsApiUrl: '//node-hnapi.herokuapp.com',
  fakeCrudApi: '/api/fakecrud',
};

export const defaultServerApplicationConfig: ApplicationConfig = {
  ...defaultApplicationConfig,
  networkTimeout: 2000,
  fakeCrudApi: '//127.0.0.1:4000/api/fakecrud',
};

export const defaultClientApplicationConfig: ApplicationConfig = {
  ...defaultApplicationConfig,
  networkTimeout: 10000,
  fakeCrudApi: '/api/fakecrud',
};
