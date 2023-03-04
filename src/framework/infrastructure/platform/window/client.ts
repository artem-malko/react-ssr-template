import { WindowAPI } from './types';

export const createWindowApi = (window: Window): WindowAPI => {
  const client = window;

  return {
    getLocationHref() {
      return client.location.href;
    },

    changeLocationHref(url: string) {
      // eslint-disable-next-line functional/immutable-data
      client.location.href = url;
    },

    open(url, name, specs) {
      return client.open(url, name, specs);
    },
    reload() {
      client.location.reload();
    },
    delayClose(time = 0) {
      client.setTimeout(() => client.close(), time);
    },

    historyPush(state, url) {
      client.history.pushState(state, '', url);
    },

    historyReplace(state, url) {
      client.history.replaceState(state, '', url);
    },

    historyBack() {
      client.history.back();
    },

    setTitle(title) {
      client.document.title = title;
    },
  };
};
