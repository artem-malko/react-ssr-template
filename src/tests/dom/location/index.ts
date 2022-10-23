import { stub } from 'sinon';

interface MockedLocation extends Location {
  assign: ReturnType<typeof stub>;
  reload: ReturnType<typeof stub>;
  replace: ReturnType<typeof stub>;
}

interface MockedWindow extends Window {
  location: MockedLocation;
}

export function mockWindowLocation(win: Window = window, href = win.location.href) {
  const locationMocks: Partial<MockedLocation> = {
    reload: stub(),
    assign: stub(),
    replace: stub(),
  };

  return replaceLocation(href);

  function replaceLocation(url: string) {
    // @ts-ignore
    delete win.location; // eslint-disable-line functional/immutable-data
    // eslint-disable-next-line functional/immutable-data
    win.location = Object.assign(new URL(url), locationMocks) as any;
    return win as MockedWindow;
  }
}
