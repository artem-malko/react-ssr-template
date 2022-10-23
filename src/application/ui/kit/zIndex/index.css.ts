import { createStyles } from 'framework/infrastructure/css/hook';

export const styles = createStyles({
  top: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    height: '100%',
    pointerEvents: 'none',
  },

  middle: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    height: '100%',
    pointerEvents: 'none',
  },

  base: {
    position: 'relative',
    height: '100%',
  },
});
