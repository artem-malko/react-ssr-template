import { createStyles } from 'framework/public/styles';

import { colors } from 'application/shared/styles/shared';

export const styles = createStyles({
  root: {
    position: 'relative',
    isolation: 'isolate',
    background: colors.white.base(),
    borderRadius: 4,
    height: '100%',
    overflow: 'hidden',
  },

  closeWrapper: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },

  closeButton: {
    position: 'absolute',
    padding: 2,
    fontSize: '22px',
    lineHeight: '22px',
    cursor: 'pointer',
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 80%,rgba(255,255,255,0) 100%)',
    pointerEvents: 'auto',
  },

  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
});
