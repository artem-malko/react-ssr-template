import clientCookie from 'js-cookie';
import { Cookie } from './types';

export const createCookieAPI = (): Cookie => ({
  set(name: string, value: string, options?: clientCookie.CookieAttributes) {
    if (options && 'maxAge' in options && typeof options['maxAge'] !== 'undefined') {
      // eslint-disable-next-line functional/immutable-data
      options['Max-Age'] = (options['maxAge'] as any).toString();
      // eslint-disable-next-line functional/immutable-data
      delete options['maxAge'];
    }

    clientCookie.set(name, value, options);
  },
  get(name: string) {
    return clientCookie.get(name);
  },

  delete(name: string, options?: clientCookie.CookieAttributes) {
    clientCookie.remove(name, options);
  },
});
