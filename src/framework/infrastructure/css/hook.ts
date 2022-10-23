import { useContext, useMemo } from 'react';
import { Styles } from './types';
import { CSSProviderContext } from './provider';

export const useStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
) => {
  const { css } = useContext(CSSProviderContext);

  return useMemo(() => css(styles), [css, styles]);
};

export const createStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
): StyleDescriptor => styles;
