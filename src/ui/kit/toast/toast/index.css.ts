import { createStyles } from 'infrastructure/css/hook';
import { colors, midTransitionDuration } from 'ui/styles/shared';

export const styles = createStyles({
  item: {
    padding: '10px',
    boxSizing: 'border-box',
    width: '100%',
    background: colors.white.base(),
    border: `2px solid ${colors.violet.base()}`,
    borderRadius: '2px',
    transition: `opacity ease ${midTransitionDuration}ms`,
    pointerEvents: 'auto',
  },

  bar: {
    height: '4px',
    background: colors.orange.base(),
    width: '100%',
    transitionProperty: 'width',
    transitionTimingFunction: 'linear',
  },
});
