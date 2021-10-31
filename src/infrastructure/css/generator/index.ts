import { Style } from '../types';
import { cssify } from './utils';

// @TODO_someday generate different styles by user agent!
export function generateCss(prefixedStyles: Style, dir: 'ltr' | 'rtl' = 'ltr') {
  return Object.keys(prefixedStyles).reduce<string>((res, hash) => {
    res += cssify((prefixedStyles as any)[hash], hash, dir);
    return res;
  }, '');
}
