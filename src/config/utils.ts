/**
 * Takes ready config object, env params and merge to config all valid params from env.
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
 * If envExcludeByRegexp is /^client_/i, then we will have:
 * { port: 3000, timeout: 10000, url: 'c.d.com' } — url option is replaced by env value
 *
 * If envExcludeByRegexp is /^server_/i, then we will have:
 * { port: 5000, timeout: 10000, url: 's.d.com' } — url  and port options are replaced by env values
 *
 * SOMETHING_ELSE was ignored, cause it is not in initialConfig object
 */
export function parseEnvParams<T extends { [keys: string]: any }>(
  baseConfig: T,
  envParams: NodeJS.ProcessEnv,
  envExcludeByRegexp: RegExp,
): T {
  const configKeys = Object.keys(baseConfig);
  const mutableCamelCasedEnvParamToRawEnvParamMap: { [keys: string]: string } = {};
  const envParamsKeys = Object.entries(envParams)
    .filter(([key]) => envExcludeByRegexp.test(key))
    .map(([key]) => {
      const camelCasedParam = key
        .replace(envExcludeByRegexp, '')
        .toLowerCase()
        .replace(/_([a-z])/g, (match, p1) => match.replace(match, p1.toUpperCase()));
      mutableCamelCasedEnvParamToRawEnvParamMap[camelCasedParam] = key;
      return camelCasedParam;
    });

  const parsedParamsFromEnv = envParamsKeys.reduce<{ [keys: string]: any }>((mutableResult, key) => {
    if (!configKeys.includes(key)) {
      return mutableResult;
    }

    const typeOfResult = typeof (baseConfig as any)[key];
    const paramLabel = mutableCamelCasedEnvParamToRawEnvParamMap[key];

    if (paramLabel === undefined) {
      return mutableResult;
    }

    const rawValue = envParams[paramLabel];

    switch (typeOfResult) {
      case 'number': {
        const parsedValue = Number(rawValue);

        if (!Number.isNaN(parsedValue)) {
          mutableResult[key] = parsedValue;
        }

        break;
      }

      case 'boolean':
        mutableResult[key] = rawValue === 'true' ? true : false;
        break;
      default:
        mutableResult[key] = rawValue;
    }

    return mutableResult;
  }, {});

  return {
    ...baseConfig,
    ...parsedParamsFromEnv,
  };
}
