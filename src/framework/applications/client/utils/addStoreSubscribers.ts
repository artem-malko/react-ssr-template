import { Store } from 'redux';

import { replaceState } from 'framework/infrastructure/router/redux/actions/router';
import { onHistoryMove } from 'framework/infrastructure/router/redux/middlewares/historyActons';
import { AnyAppState } from 'framework/infrastructure/router/types';

export function addStoreSubscribers(store: Store<AnyAppState>) {
  onHistoryMove((curAppContext) => {
    store.dispatch(replaceState(curAppContext));
  });
}
