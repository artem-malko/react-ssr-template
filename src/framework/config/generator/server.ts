import { parseEnvParams } from 'framework/config/utils/parseEnvParams';

import { BaseApplicationConfig, BaseServerConfig } from '../types';

if (process.env.APP_ENV === 'client') {
  throw new Error('Config generator should not be existed on client!');
}

const envParams = (process && process.env) || {};

/**
 * Build config for a server which serve an application
 */
const buildServerConfig = <Config extends BaseServerConfig>(serverConfig: Config): Config => {
  return {
    ...serverConfig,
    ...parseEnvParams(serverConfig, envParams, 'server'),
  };
};

/**
 * Build config for an application on server side
 */
const buildServerApplicationConfig = <Config extends BaseApplicationConfig>(
  serverApplicationConfig: Config,
): Config => {
  return {
    ...serverApplicationConfig,
    ...parseEnvParams(serverApplicationConfig, envParams, 'app'),
    ...parseEnvParams(serverApplicationConfig, envParams, 'server_app'),
  };
};

/**
 * Build config for an application on client side
 */
const buildClientApplicationConfig = <Config extends BaseApplicationConfig>(
  clientApplicationConfig: Config,
): Config => {
  return {
    ...clientApplicationConfig,
    ...parseEnvParams(clientApplicationConfig, envParams, 'app'),
    ...parseEnvParams(clientApplicationConfig, envParams, 'client_app'),
  };
};

export { buildClientApplicationConfig, buildServerApplicationConfig, buildServerConfig };
