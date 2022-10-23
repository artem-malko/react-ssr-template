export interface WindowAPI {
  delayClose(time?: number): void;
  getLocationHref(): string;
  changeLocationHref(url: string): void;
  open(url?: string, name?: string, specs?: string): Window | null;
  reload(forcedReload?: boolean): void;

  historyBack(): void;
  historyPush(state: any, url: string): void;
  historyReplace(state: any, url: string): void;
}
