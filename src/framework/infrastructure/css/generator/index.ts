import { Styles } from '../types';
import { cssify } from './utils';

export function generateCss<ClassNames extends string>(
  prefixedStyles: Styles<ClassNames>,
  dir: 'ltr' | 'rtl' = 'ltr',
) {
  return Object.keys(prefixedStyles).reduce<string>((res, hash) => {
    res += cssify((prefixedStyles as any)[hash], hash, dir);
    return res;
  }, '');
}
