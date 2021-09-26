import { CookieAPI } from './cookie/types';
import { WindowAPI } from './window/types';

/**
 * This is a wrapper for all platform dependent APIs like cookie and window
 */
/* istanbul ignore next */
export const createPlatformAPI = (params: { envSpecificAPIs: EnvSpecificAPIs }) => {
  const { envSpecificAPIs } = params;

  return {
    window: envSpecificAPIs.window,
    cookies: envSpecificAPIs.cookies,
  };
};

export type EnvSpecificAPIs = {
  cookies: CookieAPI;
  window: WindowAPI;
};

export type PlatformAPI = ReturnType<typeof createPlatformAPI>;
