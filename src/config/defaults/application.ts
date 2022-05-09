import { ApplicationConfig } from '../types';

export const defaultApplicationConfig: ApplicationConfig = {
  networkTimeout: 10000,
  publicPath: '/public/',

  hackerNewsAPIURL: '//node-hnapi.herokuapp.com',
  fakeCRUDAPI: '//127.0.0.1:5000',
};

export const defaultServerApplicationConfig: ApplicationConfig = {
  ...defaultApplicationConfig,
  networkTimeout: 2000,
  fakeCRUDAPI: '//127.0.0.1:5000',
};

export const defaultClientApplicationConfig: ApplicationConfig = {
  ...defaultApplicationConfig,
  networkTimeout: 10000,
  fakeCRUDAPI: '',
};
