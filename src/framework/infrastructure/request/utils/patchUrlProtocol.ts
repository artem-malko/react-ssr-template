import { isServer } from 'lib/browser';

/**
 * Add http for server-side requests to protocol-less urls
 */
export function patchUrlProtocol(url: string) {
  if (isServer && !url.indexOf('//')) {
    return `http:${url}`;
  }

  return url;
}
