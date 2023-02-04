import { colors, midTransitionDuration } from 'application/ui/styles/shared';
import { createStyles } from 'framework/public/styles';

export const styles = createStyles({
  root: {
    position: 'relative',
    isolation: 'isolate',
  },

  content: {
    position: 'relative',
    zIndex: 1,
  },

  glass: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: colors.white.base(0),
    transitionProperty: 'background-color',
    transitionDuration: `${midTransitionDuration}ms`,
    pointerEvents: 'none',

    _shown: {
      backgroundColor: colors.white.base(0.7),
      pointerEvents: 'auto',
    },
  },
});
