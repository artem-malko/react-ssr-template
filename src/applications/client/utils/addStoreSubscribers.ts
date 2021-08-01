import { AppState } from 'core/store/types';
import { replaceState } from 'infrastructure/router/actions';
import { onHistoryMove } from 'infrastructure/router/middlewares/historyActons';
import { Store } from 'redux';

export function addStoreSubscribers(store: Store<AppState>) {
  onHistoryMove((curAppContext) => {
    store.dispatch(replaceState(curAppContext));
  });
}
