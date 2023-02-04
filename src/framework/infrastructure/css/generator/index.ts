import { cssify } from './utils';
import { Styles } from '../types';

export function generateCss<ClassNames extends string>(
  prefixedStyles: Styles<ClassNames>,
  dir: 'ltr' | 'rtl' = 'ltr',
) {
  return Object.keys(prefixedStyles).reduce<string>((res, hash) => {
    res += cssify((prefixedStyles as any)[hash], hash, dir);
    return res;
  }, '');
}
