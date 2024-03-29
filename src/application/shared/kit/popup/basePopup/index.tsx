import { memo, PropsWithChildren, useCallback } from 'react';

import { useStyles } from 'framework/public/styles';

import { ZIndexLayout } from 'application/shared/kit/zIndex';

import { styles } from './index.css';
import { usePopupActions } from '../infrastructure/hook';

type Props = {
  hideCloseButton?: boolean;
  popupId: string;
};
export const BasePopup = memo<PropsWithChildren<Props>>(({ children, hideCloseButton, popupId }) => {
  const css = useStyles(styles);
  const { closePopupById } = usePopupActions();
  const onCloseClick = useCallback(() => {
    closePopupById(popupId);
  }, [closePopupById, popupId]);

  return (
    <div className={css('root')}>
      <ZIndexLayout
        top={
          !hideCloseButton ? (
            <div className={css('closeWrapper')}>
              <div onClick={onCloseClick} className={css('closeButton')}>
                ✖️
              </div>
            </div>
          ) : (
            <></>
          )
        }
        base={<div className={css('body')}>{children}</div>}
      />
    </div>
  );
});
