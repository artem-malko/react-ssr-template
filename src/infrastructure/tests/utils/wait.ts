import { SinonFakeTimers } from 'sinon';

export const waitForNextTickWithMockedTimers = async (clock: SinonFakeTimers, ms: number) => {
  clock.tick(ms);
  await new Promise<void>((resolve) => {
    resolve();
  });
  clock.runMicrotasks();
};

export const waitForResolve = (callback: () => any) => Promise.resolve().then(callback);
