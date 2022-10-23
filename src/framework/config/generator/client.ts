import { isServer } from 'lib/browser';

import { BaseApplicationConfig } from '../types';
import { APPLICATION_CONFIG_VAR_NAME } from './shared';

export const getClientApplicationConfig = <Config extends BaseApplicationConfig>(): Config => {
  if (isServer) {
    throw new Error('Can not get client config on a server!');
  }

  if (!(window as any)[APPLICATION_CONFIG_VAR_NAME]) {
    throw new Error('Config is not found in window!');
  }

  return (window as any)[APPLICATION_CONFIG_VAR_NAME];
};
