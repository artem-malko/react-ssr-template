import { colors } from 'application/ui/styles/shared';
import { createStyles } from 'framework/public/styles';

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
