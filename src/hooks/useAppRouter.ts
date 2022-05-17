import { withSelectors } from 'core/signals';
import { openPageSignal, patchPageSignal } from 'core/signals/page';
import { Page } from 'core/store/types';
import { noop, sequence } from 'infrastructure/signal';
import { selectPage } from 'core/selectors';
import { useDispatch } from 'react-redux';

export const useAppRouter = () => {
  const dispatch = useDispatch();

  /**
   * Opens new pages and return a promise with new page from a state
   * Just a wrapper around redux part of the routing
   * This wrapper allows to replace redux with something else,
   * without an application deep refactoring
   */
  const openPage = <P extends Page>(page: P, useReplace = false) =>
    new Promise<Page>((resolve) => {
      dispatch(
        sequence(
          openPageSignal(page, useReplace),
          withSelectors(
            {
              newPage: selectPage,
            },
            ({ newPage }) => {
              resolve(newPage);
              return noop();
            },
          ),
        ),
      );
    });

  /**
   * Patches new page and return a promise with updated page from a state
   * Just a wrapper around redux part of the routing
   * This wrapper allows to replace redux with something else,
   * without an application deep refactoring
   */
  const patchPage = <P extends Page>(patcher: (activePage: P) => P, useReplace = false) =>
    new Promise<Page>((resolve) => {
      dispatch(
        sequence(
          // @TODO fix types
          patchPageSignal(patcher as any, useReplace),
          withSelectors(
            {
              patchedPage: selectPage,
            },
            ({ patchedPage }) => {
              resolve(patchedPage);
              return noop();
            },
          ),
        ),
      );
    });

  return {
    openPage,
    patchPage,
  };
};
