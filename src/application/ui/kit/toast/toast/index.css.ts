import { colors, midTransitionDuration } from 'application/ui/styles/shared';
import { createStyles } from 'framework/public/styles';

export const styles = createStyles({
  item: {
    position: 'relaitve',
    width: '100%',
    background: colors.white.base(),
    border: `2px solid ${colors.violet.base()}`,
    borderRadius: '2px',
    transition: `opacity ease ${midTransitionDuration}ms`,
    pointerEvents: 'auto',
  },

  close: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
    fontSize: '22px',
    lineHeight: '22px',
    cursor: 'pointer',
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 80%,rgba(255,255,255,0) 100%)',
    pointerEvents: 'auto',
  },

  body: {
    padding: 4,
  },

  bar: {
    height: '4px',
    background: colors.orange.base(),
    width: '100%',
    transitionProperty: 'width',
    transitionTimingFunction: 'linear',
  },
});
