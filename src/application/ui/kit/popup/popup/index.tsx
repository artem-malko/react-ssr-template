import { memo, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { FadeIn } from 'application/ui/kit/fadeIn';
import { useStyles } from 'framework/public/styles';
import { useSession } from 'framework/public/universal';
import { useOutsideClick } from 'lib/hooks/useOutsideClick';
import { noopFunc } from 'lib/lodash';

import { styles } from './index.css';
import { PopupControllerContext } from '../infrastructure/context';
import { Popup as PopupType } from '../types';

/**
 * This is just a controller for any popup
 * There is no any UI for a popup body, you have to create it by yourself
 */
export const Popup = memo(() => {
  const css = useStyles(styles);
  const [, rerender] = useState(0);
  const popupController = useContext(PopupControllerContext);
  const popupRef = useRef<PopupType[]>([]);
  const popupWrapperElementRef = useRef<HTMLDivElement | null>(null);
  const { isMobile } = useSession();

  useEffect(() => {
    const unsubscribe = popupController.subscribeToChanges((event) => {
      switch (event.type) {
        case 'add': {
          popupRef.current = popupRef.current.concat(event.popup);
          break;
        }
        case 'remove': {
          const indexOfPopup = popupRef.current.findIndex((t) => t.id === event.popupId);

          if (indexOfPopup !== -1) {
            popupRef.current.splice(indexOfPopup, 1);
          }
          break;
        }
        case 'removeAll': {
          popupRef.current = [];
          break;
        }
      }

      rerender(Math.random());
    });

    return () => {
      unsubscribe();
    };
  }, [popupController]);

  const popupToRender = popupRef.current[popupRef.current.length - 1];

  const hideCurrentPopup = useCallback(() => {
    if (!popupToRender) {
      return;
    }

    popupRef.current.pop();
    rerender(Math.random());
    popupToRender.onClose ? popupToRender.onClose() : noopFunc();
  }, [popupToRender]);

  // Block scroll of the page, if any popup is opened
  useLayoutEffect(() => {
    if (popupToRender) {
      // eslint-disable-next-line functional/immutable-data
      document.body.style.overflow = 'hidden';
    } else {
      // eslint-disable-next-line functional/immutable-data
      document.body.style.overflow = 'auto';
    }
  }, [popupToRender]);

  useEffect(() => {
    if (!popupToRender?.options?.closeOnEscape) {
      return;
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        hideCurrentPopup();
      }
    };
    window.addEventListener('keyup', handler);

    return () => {
      window.removeEventListener('keyup', handler);
    };
  }, [hideCurrentPopup, popupToRender?.options?.closeOnEscape]);

  useOutsideClick({
    sourceRef: popupWrapperElementRef,
    isShown: !!popupToRender,
    hide: popupToRender?.options?.closeOnOverlayClick ? hideCurrentPopup : noopFunc,
  });

  const rootMods = popupToRender ? ['_has_popup' as const] : [];
  const popupMods = isMobile ? ['_mobile' as const] : [];
  const mutableInlineStyles = {
    minHeight: popupToRender?.options?.minHeight,
    maxHeight: popupToRender?.options?.maxHeight,
    minWidth: popupToRender?.options?.minWidth,
    maxWidth: popupToRender?.options?.maxWidth,
  };

  return (
    <div className={css('root', rootMods)}>
      <div className={css('overlay', rootMods)} />
      <div ref={popupWrapperElementRef}>
        {/* Key is used to restart fade animation */}
        <FadeIn isShown={!!popupToRender} key={popupToRender?.id}>
          {!!popupToRender && (
            <div className={css('popup', popupMods)} style={mutableInlineStyles}>
              {popupToRender.body({
                closePopup: hideCurrentPopup,
                popupId: popupToRender.id,
              })}
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
});
