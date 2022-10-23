import { createStubedCookieAPI } from './cookie/stub';
import { createStubedWindowAPI } from './window/stub';

export type StubedPlatformAPIs = ReturnType<typeof createStubedPlatformAPIs>;

/* istanbul ignore next */
export const createStubedPlatformAPIs = () => ({
  cookies: createStubedCookieAPI(),
  window: createStubedWindowAPI(),
});
