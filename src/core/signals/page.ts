import { openPageAction } from 'core/actions/appContext/openPage';
import { Page } from 'core/store/types';
import { historyPush, historyReplace } from 'infrastructure/router/actions';
import { createSignal, noop, sequence } from 'infrastructure/signal';
import { withSelectors } from '.';

export const openPageSignal = createSignal('openPage', (page: Page, useReplace?: boolean) =>
  sequence(openPageAction(page), useReplace ? historyReplace() : historyPush()),
);

/**
 * Useful in cases, when you need to change params of the current page
 */
export const patchPageSignal = createSignal(
  'patchPage',
  (patcher: <P extends Page>(activePage: P) => P | undefined, useReplace?: boolean) => {
    return withSelectors(
      {
        activePage: (state) => state.appContext.page,
      },
      ({ activePage }) => {
        const newPage = patcher(activePage);

        if (!newPage || newPage === activePage || newPage.name !== activePage.name) {
          return noop();
        }

        return sequence(openPageAction(newPage), useReplace ? historyReplace() : historyPush());
      },
    );
  },
);
