import { replaceState } from 'framework/infrastructure/router/redux/actions/router';
import { onHistoryMove } from 'framework/infrastructure/router/redux/middlewares/historyActons';
import { AnyAppState } from 'framework/infrastructure/router/types';
import { Store } from 'redux';

export function addStoreSubscribers(store: Store<AnyAppState>) {
  onHistoryMove((curAppContext) => {
    store.dispatch(replaceState(curAppContext));
  });
}
