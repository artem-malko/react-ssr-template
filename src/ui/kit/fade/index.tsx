import { memo, PropsWithChildren, useState, useEffect, useMemo } from 'react';
import { styles } from './index.css';
import { midTransitionDuration } from 'ui/styles/shared';
import { useStyles } from 'infrastructure/css/hook';

type Props = {
  transitionDuration?: number;
  transitionDelay?: number;
  isShown: boolean;
  isInitiallyShown?: boolean;
};
export const Fade = memo<PropsWithChildren<Props>>(
  ({
    transitionDuration = midTransitionDuration,
    transitionDelay = 0,
    isShown,
    children,
    isInitiallyShown,
  }) => {
    const [shouldAnimate, setSouldAnimate] = useState(false);
    const [internalIsInitiallyShown, setInternalIsInitiallyShown] = useState(isInitiallyShown);
    const css = useStyles(styles);
    const inlineStyles = useMemo(() => {
      if (internalIsInitiallyShown) {
        return {};
      }

      return {
        transitionDuration: `${transitionDuration}ms`,
        transitionDelay: `${transitionDelay}ms`,
      };
    }, [transitionDuration, transitionDelay, internalIsInitiallyShown]);

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
