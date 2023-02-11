import { commonWithSelectors, noop, sequence } from 'framework/infrastructure/signal';

import { useRouterReduxDispatch } from '../redux/hooks';
import { selectAnyPage } from '../redux/selectors';
import { openPageSignal, patchPageSignal } from '../redux/signals/page';
import { AnyPage } from '../types';

export const useCommonNavigate = <
  AppPage extends AnyPage<string>,
  DestinationPage extends AppPage,
>() => {
  const dispatch = useRouterReduxDispatch();

  /**
   * Opens new pages and return a promise with that new page from a state
   * Just a wrapper around redux part of the routing
   * This wrapper allows to replace redux with something else,
   * without an application deep refactoring
   */
  /**
   * Patches new page and return a promise with updated page from a state
   * Just a wrapper around redux part of the routing
   * This wrapper allows to replace redux with something else,
   * without an application deep refactoring
   */
  const navigate = (
    destination: DestinationPage | ((activePage: AppPage) => DestinationPage),
    useReplace = false,
  ) =>
    new Promise<DestinationPage>((resolve) => {
      dispatch(
        sequence(
          typeof destination === 'function'
            ? // @TODO fix typings
              patchPageSignal(destination as any, useReplace)
            : openPageSignal(destination),
          commonWithSelectors(
            {
              patchedPage: selectAnyPage,
            },
            ({ patchedPage }) => {
              resolve(patchedPage as DestinationPage);
              return noop();
            },
          ),
        ),
      );
    });

  return {
    navigate,
  };
};
