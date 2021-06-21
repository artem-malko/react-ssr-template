import { MouseEvent } from 'react';
const isClient =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';
export const isServer = !isClient;
export const isTest = process.env.NODE_ENV === 'test';

export function isIE(UA: string) {
  const lowerCasedUA = UA.toLowerCase();

  return lowerCasedUA.indexOf('msie') !== -1 || lowerCasedUA.indexOf('trident') !== -1;
}

/* istanbul ignore next */
export function isNewTabOpenRequest(e: MouseEvent<HTMLAnchorElement>) {
  return e.metaKey || e.ctrlKey;
}

export const getViewportSize = () => {
  if (isServer) {
    return {
      width: 0,
      height: 0,
    };
  }

  const body = document.body;
  const html = document.documentElement;

  return {
    width: Math.max(body.offsetWidth, html.clientWidth, html.offsetWidth),
    height: Math.max(body.offsetHeight, html.clientHeight, html.offsetHeight),
  };
};
