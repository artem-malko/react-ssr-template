import { createStyles } from 'infrastructure/css/hook';
import { colors } from 'ui/styles/shared';

export const styles = createStyles({
  root: {
    position: 'sticky',
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
