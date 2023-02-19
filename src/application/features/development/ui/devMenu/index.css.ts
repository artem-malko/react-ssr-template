import { createStyles } from 'framework/public/styles';

import { colors } from 'application/shared/styles/shared';

export const styles = createStyles({
  root: {
    position: 'relative',
    zIndex: 1,
    height: 50,
  },

  menu: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    display: 'flex',
    background: colors.black.base(),
    color: colors.white.base(),
  },

  link: {
    cursor: 'pointer',
    paddingInlineEnd: 10,
    paddingInlineStart: 10,
    fontSize: 18,
  },
});
