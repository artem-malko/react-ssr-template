import { createStyles } from 'framework/public/styles';

import { colors } from 'application/shared/styles/shared';

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
