import { useContext, useMemo } from 'react';
import { Styles } from './types';
import { CSSProviderContext } from './provider';

export const useStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
) => {
  const { css } = useContext(CSSProviderContext);
  // It depends on styles, but it is ok to not add styles to useMemo dependencies
  // because styles will be passed here only one time.
  // So, useMemo won't do any useless work to equal styles between calls
  return useMemo(() => css(styles), [css, styles]);
};

type AllowedInlineStyleProperties =
  | 'width'
  | 'height'
  | 'transition'
  | 'color'
  | 'background'
  | 'fontSize';
export type AllowedInlineStyle = { [key in AllowedInlineStyleProperties]?: string };
export const useStaticInlineStyle = (styles?: AllowedInlineStyle) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => styles, []);
};

export const createStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
): StyleDescriptor => styles;
