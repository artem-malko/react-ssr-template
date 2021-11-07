import { memo, PropsWithChildren, useState, useEffect, useMemo } from 'react';
import { styles } from './index.css';
import { midTransitionDuration } from 'ui/styles/shared';
import { useStyles } from 'infrastructure/css/hook';

type Props = {
  transition?: number;
  delay?: number;
  isShown: boolean;
  isInitiallyShown?: boolean;
};
export const Fade = memo<PropsWithChildren<Props>>(
  ({ transition, delay, isShown, children, isInitiallyShown }) => {
    const [shouldAnimate, setSouldAnimate] = useState(false);
    const [internalIsInitiallyShown, setInternalIsInitiallyShown] = useState(isInitiallyShown);
    const css = useStyles(styles);
    const inlineStyles = useMemo(() => {
      if (internalIsInitiallyShown) {
        return {};
      }

      return {
        transitionDuration: transition ? `${transition}ms` : `${midTransitionDuration}ms`,
        transitionDelay: delay ? `${delay}ms` : '0s',
      };
    }, [transition, delay, internalIsInitiallyShown]);

    useEffect(() => {
      setSouldAnimate(isShown);
      setInternalIsInitiallyShown(false);
    }, [isShown]);

    return (
      <div
        className={css('fade', shouldAnimate || internalIsInitiallyShown ? ['_shown'] : [])}
        style={inlineStyles}
      >
        {shouldAnimate && children}
      </div>
    );
  },
);
Fade.displayName = 'Fade';
