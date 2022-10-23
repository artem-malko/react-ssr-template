import { useContext, useMemo } from 'react';

import { CSSProviderContext } from './provider';
import { Styles } from './types';

export const useStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
) => {
  const { css } = useContext(CSSProviderContext);

  return useMemo(() => css(styles), [css, styles]);
};

export const createStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
): StyleDescriptor => styles;
