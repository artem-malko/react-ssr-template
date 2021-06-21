import { isServer } from 'lib/browser';
import { v4 as uuid } from 'uuid';

/**
 * Add http for server-side requests to protocol-less urls
 */
export function patchUrl(url: string) {
  if (isServer && !url.indexOf('//')) {
    return `http:${url}`;
  }

  return url;
}

/* istanbul ignore next */
export function generateRequestId(): string {
  return process.env.NODE_ENV === 'test' ? 'requestId' : uuid();
}
