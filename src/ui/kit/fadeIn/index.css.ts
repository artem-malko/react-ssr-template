import { createStyles } from 'infrastructure/css/hook';

export const styles = createStyles({
  fade: {
    opacity: 0,
    transitionProperty: 'opacity',

    _shown: {
      opacity: 1,
    },
  },
});
