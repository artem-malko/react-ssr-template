import { ApplicationConfig, ServerConfig } from '../types';
import { defaultServerConfig } from '../defaults/server';
import { parseEnvParams } from '../utils';
import { defaultServerApplicationConfig, defaultClientApplicationConfig } from '../defaults/application';
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
    ...parseEnvParams(defaultServerConfig, envParams, /^server_/i),
    ...local.serverConfig,
  };
};

/**
 * Build config for an application on server side
 */
const buildServerApplicationConfig = (): ApplicationConfig => {
  return {
    ...parseEnvParams(defaultServerApplicationConfig, envParams, /^server_/i),
    ...local.serverApplicationConfig,
  };
};

/**
 * Build config for an application on client side
 */
const buildClientApplicationConfig = (): ApplicationConfig => {
  return {
    ...parseEnvParams(defaultClientApplicationConfig, envParams, /^client_/i),
    ...local.clientApplicationConfig,
  };
};

const clientApplicationConfig = buildClientApplicationConfig();
const serverApplicationConfig = buildServerApplicationConfig();
const serverConfig = buildServerConfig();

export { clientApplicationConfig, serverApplicationConfig, serverConfig };
