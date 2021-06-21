import { ApplicationConfig } from '../types';

export const defaultApplicationConfig: ApplicationConfig = {
  networkTimeout: 10000,
  publicPath: '/public/',

  hackerNewsAPIURL: '//node-hnapi.herokuapp.com',
};

export const defaultServerApplicationConfig: ApplicationConfig = {
  ...defaultApplicationConfig,
  networkTimeout: 2000,
};

export const defaultClientApplicationConfig: ApplicationConfig = {
  ...defaultApplicationConfig,
  networkTimeout: 10000,
};
