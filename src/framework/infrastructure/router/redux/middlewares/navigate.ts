import { MiddlewareAPI, Action, Dispatch } from 'redux';

import { isServer } from 'lib/browser';

import { push, replace, back } from './historyActons';
import { AnyAppState, AnyAppContext } from '../../types';

/**
 * Push or replace an application state to a browser history.
 * Returns true if server-side redirect occured, false otherwise.
 * On client, always returns false.
 */
export function createNavigator(compileURL: (appContext: AnyAppContext) => string) {
  return (action: Action, store: MiddlewareAPI<Dispatch, AnyAppState>): boolean => {
    if (!isServer) {
      const appContext = store.getState().appContext;
      const urlFromState = compileURL(appContext);

      switch (action.type) {
        case 'historyPush':
          push(urlFromState, appContext);
          return true;
        case 'historyBack':
          back(urlFromState);
          return true;
        case 'historyReplace':
        case 'historyRedirect': // on client, redirect means replace
          replace(urlFromState, appContext);
          return true;
        default:
      }
    } else {
      // separate handling of redirects on server
      if (action.type === 'historyRedirect') {
        return true;
      }
    }

    return false;
  };
}
