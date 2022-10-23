
import { openAnyPageAction } from 'framework/infrastructure/router/redux/actions/appContext/openPageAction';
import { historyPush, historyReplace } from 'framework/infrastructure/router/redux/actions/router';
import { commonWithSelectors, createSignal, sequence } from 'framework/infrastructure/signal';

import { AnyPage } from '../../types';

export const openPageSignal = createSignal(
  'openPageSignal',
  (page: AnyPage<string>, useReplace?: boolean) =>
    sequence(openAnyPageAction(page), useReplace ? historyReplace() : historyPush()),
);

/**
 * Useful in cases, when you need to change params of the current page
 */
export const patchPageSignal = createSignal(
  'patchPageSignal',
  (patcher: (activePage: AnyPage<string>) => AnyPage<string>, useReplace?: boolean) => {
    return commonWithSelectors(
      {
        activePage: (state) => state.appContext.page,
      },
      ({ activePage }) => {
        const newPage = patcher(activePage);

        return sequence(openAnyPageAction(newPage), useReplace ? historyReplace() : historyPush());
      },
    );
  },
);
