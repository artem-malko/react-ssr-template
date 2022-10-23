import { AnyAppContext } from '../../types';

/**
 *
 */
export function push(url: string, appContext: AnyAppContext) {
  const nState = {
    appContext,
  };

  if (currentUrl() === url) {
    return;
  }
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`%c➔ %c${decodeURIComponent(url)}`, 'color: #090', 'color: #999', appContext);
  }
  window.history.pushState(nState, '', url);
}

export function replace(url: string, appContext: AnyAppContext) {
  const nState = {
    appContext,
  };

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`%c↺ %c${decodeURIComponent(url)}`, 'color: #900', 'color: #999', appContext);
  }
  window.history.replaceState(nState, '', url);
}

function currentUrl() {
  return decodeURIComponent(window.location.pathname + window.location.search);
}

export function back(url: string) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`%c← %c${decodeURIComponent(url)}`, 'color: #900', 'color: #999');
  }
  window.history.back();
}

export function onHistoryMove(cb: (appContext: AnyAppContext) => void) {
  window.onpopstate = (event: PopStateEvent) => {
    if (!event.state) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[history] Popped state: ', event.state);
    }

    cb(event.state);
  };
}
