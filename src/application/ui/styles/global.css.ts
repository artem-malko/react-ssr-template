import { createStyles } from 'framework/public/styles';

import { keyframeNames } from './shared';

export const styles = createStyles({
  ':global': {
    [`@keyframes ${keyframeNames.opacity}`]: {
      from: {
        opacity: 0,
      },

      to: {
        opacity: 1,
      },
    },
  },
});
