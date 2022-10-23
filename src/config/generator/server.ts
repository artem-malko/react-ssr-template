import { parseEnvParams } from 'framework/config/utils/parseEnvParams';
import { removeUndefinedFields } from 'framework/config/utils/removeUndefinedFields';

import { defaultServerApplicationConfig, defaultClientApplicationConfig } from '../defaults/application';
import { defaultServerConfig } from '../defaults/server';
import { ApplicationConfig, ServerConfig } from '../types';
import localTemplate from './local_template';


if (process.env.APP_ENV === 'client') {
  throw new Error('Config generator should not be existed on client!');
}

const envParams = (process && process.env) || {};

let local = localTemplate;

try {
  if (process.env.NODE_ENV !== 'production') {
    local = require('./local').default;
  }
} catch {
  // No local config provided, nothing to do
}

/**
 * Build config for a server which serve an application
 */
const buildServerConfig = (): ServerConfig => {
  return {
    ...defaultServerConfig,
    ...removeUndefinedFields(parseEnvParams(defaultServerConfig, envParams, 'server')),
    ...removeUndefinedFields(local.serverConfig),
  };
};

/**
 * Build config for an application on server side
 */
const buildServerApplicationConfig = (): ApplicationConfig => {
  return {
    ...defaultServerApplicationConfig,
    ...removeUndefinedFields(parseEnvParams(defaultServerApplicationConfig, envParams, 'server_app')),
    ...removeUndefinedFields(local.serverApplicationConfig),
  };
};

/**
 * Build config for an application on client side
 */
const buildClientApplicationConfig = (): ApplicationConfig => {
  return {
    ...defaultClientApplicationConfig,
    ...removeUndefinedFields(parseEnvParams(defaultClientApplicationConfig, envParams, 'client_app')),
    ...removeUndefinedFields(local.clientApplicationConfig),
  };
};

const clientApplicationConfig = buildClientApplicationConfig();
const serverApplicationConfig = buildServerApplicationConfig();
const serverConfig = buildServerConfig();

export { clientApplicationConfig, serverApplicationConfig, serverConfig };
