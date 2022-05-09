import { withSelectors } from 'core/signals';
import { openPageSignal, patchPageSignal } from 'core/signals/page';
import { Page } from 'core/store/types';
import { noop, sequence } from 'infrastructure/signal';
import { useDispatch } from 'react-redux';

export const useAppRouter = () => {
  const dispatch = useDispatch();

  /**
   * @TODO add description
   */
  const openPage = (page: Page, useReplace = false) =>
    new Promise<void>((resolve) => {
      dispatch(
        sequence(
          openPageSignal(page, useReplace),
          withSelectors({}, () => {
            resolve();
            return noop();
          }),
        ),
      );
    });

  /**
   * @TODO add description
   */
  const patchPage = <P extends Page>(patcher: (activePage: P) => P, useReplace = false) =>
    new Promise<void>((resolve) => {
      dispatch(
        sequence(
          // @TODO fix types
          patchPageSignal(patcher as any, useReplace),
          withSelectors({}, () => {
            resolve();
            return noop();
          }),
        ),
      );
    });

  return {
    openPage,
    patchPage,
  };
};
