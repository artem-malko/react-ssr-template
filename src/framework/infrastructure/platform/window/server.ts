import { WindowAPI } from './types';

export const createWindowApi = (): WindowAPI => ({
  getLocationHref() {
    return '';
  },

  changeLocationHref(_url: string) {
    // do nothing
  },

  delayClose() {
    // do nothing
  },

  open() {
    // null cause client window returns Window | null
    return null;
  },
  reload(_forcedReload) {
    // do nothing
  },

  historyBack() {
    // do nothing
  },
  historyPush() {
    // do nothing
  },
  historyReplace() {
    // do nothing
  },
  setTitle() {
    // do nothing
  },
});
