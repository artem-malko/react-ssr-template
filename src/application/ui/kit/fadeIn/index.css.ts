import { createStyles } from 'framework/public/styles';

export const styles = createStyles({
  fade: {
    opacity: 0,
    transitionProperty: 'opacity',

    _shown: {
      opacity: 1,
    },
  },
});
