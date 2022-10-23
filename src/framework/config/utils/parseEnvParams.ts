import snakeCase from 'lodash.snakecase';

import { AnyConfig, AnyConfigValue } from '../types';

/**
 * Takes ready config object, env params and returns all valid params from env.
 *
 * Example
 * config is { port: 3000, timeout: 10000, url: 'domain.com' }
 * env params is {
 *  SERVER_PORT: '5000',
 *  CLIENT_URL: 'c.d.com',
 *  SERVER_URL: 's.d.com,
 *  SOMETHING_ELSE: 'any',
 * }
 *
 * If prefix is "client", then we will have:
 * { port: 3000, timeout: 10000, url: 'c.d.com' } — url option is replaced by env value
 *
 * If prefix is "server", then we will have:
 * { port: 5000, timeout: 10000, url: 's.d.com' } — url  and port options are replaced by env values
 *
 * SOMETHING_ELSE was ignored, cause it is not in a referenceConfig object
 */
export function parseEnvParams<T extends AnyConfig>(
  referenceConfig: T,
  envParams: NodeJS.ProcessEnv,
  prefix?: string,
): Partial<T> {
  const mutableResult: Partial<T> = {};
  const configKeys = Object.keys(referenceConfig);

  configKeys.forEach((key) => {
    const unixKey = camel2unix(key, prefix);
    // eslint-disable-next-line no-prototype-builtins
    const envValue = envParams.hasOwnProperty(unixKey) ? envParams[unixKey] : undefined;
    const referenceConfigValue = referenceConfig[key] as AnyConfigValue;

    if (typeof envValue !== 'undefined') {
      try {
        const value = resolveValue(referenceConfigValue, envValue, key);
        if (value !== referenceConfigValue) {
          mutableResult[key as keyof T] = value as any;
        }
      } catch (e: any) {
        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.error(e.message);
        }
      }
    }
  });

  return mutableResult;
}

function resolveValue(baseValue: AnyConfigValue, envValue: string, key = 'unknown key'): AnyConfigValue {
  if (typeof baseValue === 'string') {
    return envValue;
  }

  if (typeof baseValue === 'number') {
    const value = Number(envValue);

    // If envValue — just an array of spaces, Number(envValue) returns 0
    if (value !== value || envValue.trim() === '') {
      throw new Error(`Invalid number env config value (${key}): "${envValue}"`);
    }

    return value;
  }

  if (typeof baseValue === 'boolean') {
    switch (envValue.toLowerCase()) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        throw new Error(`Invalid boolean env config value (${key}): ${envValue}`);
    }
  }

  throw new Error(`Config value is not a string/number/boolean (${key})`);
}

/**
 * utils.camel2unix('someprefix','base2ApiUrl'); =>
 * SOMEPREFIX_BASE_2_API_URL
 */
function camel2unix(str: string, prefix?: string) {
  const variableName = prefix ? `${prefix}-${str}` : str;

  return snakeCase(variableName).toUpperCase();
}
