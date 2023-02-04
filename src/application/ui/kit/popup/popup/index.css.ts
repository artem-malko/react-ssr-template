import { colors, midTransitionDuration } from 'application/ui/styles/shared';
import { createStyles } from 'framework/public/styles';

export const styles = createStyles({
  root: {
    position: 'relative',

    _has_popup: {
      width: '100%',
      height: '100%',
    },
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: `${midTransitionDuration}ms background`,
    background: 'transparent',

    _has_popup: {
      background: colors.black.base(0.3),
    },
  },

  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    overflow: 'auto',
    maxHeight: '100%',
    maxWidth: '100%',

    // 95% to show users, that current element is just a popup, not a separate page
    _mobile: {
      width: '95%',
      height: '95%',
    },
  },
});
