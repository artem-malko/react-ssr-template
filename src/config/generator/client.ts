import { APPLICATION_CONFIG_VAR_NAME } from './shared';
import { ApplicationConfig } from '../types';

export const getClientApplicationConfig = (): ApplicationConfig => {
  if (typeof window === 'undefined') {
    throw new Error('Can not get client config on server!');
  }

  if (!(window as any)[APPLICATION_CONFIG_VAR_NAME]) {
    throw new Error('Config is not found!');
  }

  return (window as any)[APPLICATION_CONFIG_VAR_NAME];
};
