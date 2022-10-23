import { parseEnvParams } from 'framework/config/utils/parseEnvParams';
import { removeUndefinedFields } from 'framework/config/utils/removeUndefinedFields';

import { BaseApplicationConfig, BaseServerConfig } from '../types';
import localTemplate from './local_template';

if (process.env.APP_ENV === 'client') {
  throw new Error('Config generator should not be existed on client!');
}

const envParams = (process && process.env) || {};

let local = localTemplate;

try {
  if (process.env.NODE_ENV !== 'production') {
    local = require('../../../local').default;
  }
} catch {
  // No local config provided, nothing to do
}

/**
 * Build config for a server which serve an application
 */
const buildServerConfig = <Config extends BaseServerConfig>(serverConfig: Config): Config => {
  return {
    ...serverConfig,
    ...removeUndefinedFields(parseEnvParams(serverConfig, envParams, 'server')),
    ...removeUndefinedFields(local.serverConfig),
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
    ...removeUndefinedFields(parseEnvParams(serverApplicationConfig, envParams, 'server_app')),
    ...removeUndefinedFields(local.serverApplicationConfig),
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
    ...removeUndefinedFields(parseEnvParams(clientApplicationConfig, envParams, 'client_app')),
    ...removeUndefinedFields(local.clientApplicationConfig),
  };
};

export { buildClientApplicationConfig, buildServerApplicationConfig, buildServerConfig };
