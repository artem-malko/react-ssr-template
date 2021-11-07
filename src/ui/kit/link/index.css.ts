import { createStyles } from 'infrastructure/css/hook';
import { colors } from 'ui/styles/shared';

export const styles = createStyles({
  link: {
    textDecoration: 'underline',

    _t_default: {
      color: colors.teal.base(),

      ':focus': {
        outlineColor: colors.teal.light(),
      },

      ':hover': {
        color: colors.teal.dark(),
      },
    },

    _no_link: {
      textDecoration: 'none',
    },
  },
});
