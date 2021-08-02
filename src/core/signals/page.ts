import { openPage } from 'core/actions/appContext/openPage';
import { Page } from 'core/store/types';
import { historyPush, historyReplace } from 'infrastructure/router/actions';
import { createSignal, noop, sequence } from 'infrastructure/signal';
import { withSelectors } from '.';

/**
 * Useful in cases, when you need to change params of current page
 */
export const patchPage = createSignal(
  'patchPage',
  (patcher: (activePage: Page) => Page | undefined, useReplace = false) => {
    return withSelectors(
      {
        activePage: (state) => state.appContext.page,
      },
      ({ activePage }) => {
        const newPage = patcher(activePage);

        if (!newPage || newPage === activePage) {
          return noop();
        }

        return sequence(openPage(newPage), useReplace ? historyReplace() : historyPush());
      },
    );
  },
);
