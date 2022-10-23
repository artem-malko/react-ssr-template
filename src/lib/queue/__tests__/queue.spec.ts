import { expect } from 'chai';
import { stub, useFakeTimers, SinonFakeTimers } from 'sinon';

import { waitForNextTickWithMockedTimers } from 'framework/infrastructure/tests/utils/wait';

import { Queue } from '../';


describe('Queue', () => {
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = useFakeTimers({
      now: 1483228800000,
      toFake: ['setTimeout'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('queue works correctly with 1 job, job is done on next tick, timeout is not passed', () => {
    const aim = {
      name: '',
    };

    const queueAction = (param: string) =>
      new Promise<void>((resolve) => {
        aim.name = param;
        resolve();
      });
    const queueInstance = new Queue({
      action: queueAction,
    });
    const mockName = 'Ann';

    queueInstance.addToQueue(mockName);

    clock.runAll();

    expect(aim.name).to.eq(mockName);
  });

  it(`
    queue works correctly with 2 jobs (timeout is 0)
    All jobs are done after 2 ticks
  `, async () => {
    const aim = {
      name: '',
    };
    const queueAction = (param: string) =>
      new Promise<void>((resolve) => {
        aim.name += param;
        resolve();
      });
    const queueInstance = new Queue({
      action: queueAction,
    });
    const mockName = 'Ann';

    queueInstance.addToQueue(mockName);
    queueInstance.addToQueue(mockName);

    await waitForNextTickWithMockedTimers(clock, 0);

    expect(aim.name).to.eq(mockName + mockName);
  });

  it(`
    queue works correctly with 2 jobs and timeout.
    Check after the first job is done, but the second job is not started`, async () => {
    const aim = {
      name: '',
    };
    const callback = stub();
    const queueAction = (param: string) =>
      new Promise<void>((resolve) => {
        aim.name += param;
        callback();
        resolve();
      });
    const queueInstance = new Queue({
      action: queueAction,
      timeout: 20,
    });
    const mockName = 'Ann';

    queueInstance.addToQueue(mockName);
    queueInstance.addToQueue(mockName);

    await waitForNextTickWithMockedTimers(clock, 30);

    expect(callback.callCount).to.eq(1);
    expect(aim.name).to.eq(mockName);
  });

  it(`
    queue works correctly if one of job is finished with error, check onErrorAction.
    Check after rejected job and after all jobs are done`, async () => {
    const aim = {
      name: '',
      error: '' as any,
    };

    const errorReason = 'errorReason';
    const queueAction = (param: string) =>
      new Promise<void>((resolve, reject) => {
        if (aim.name === '') {
          aim.name += 'rejected_';
          return reject(errorReason);
        }

        aim.name += param;
        resolve();
      });
    const onErrorAction = (err: Error) => {
      aim.error = err;
    };
    const queueInstance = new Queue({
      action: queueAction,
      timeout: 10,
      onErrorAction,
    });
    const mockName = 'Ann';

    queueInstance.addToQueue(mockName);

    await waitForNextTickWithMockedTimers(clock, 10);
    expect(aim.name).to.eq('rejected_');
    expect(aim.error.toString()).to.eq(`Error: ${errorReason}`);

    queueInstance.addToQueue(mockName);

    await waitForNextTickWithMockedTimers(clock, 20);

    expect(aim.name).to.eq(`rejected_${mockName}`);
  });
});
