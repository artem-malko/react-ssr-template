import { expect } from 'chai';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { Timer } from '..';

describe('Timer', () => {
  let clock: SinonFakeTimers;
  const state = {
    counter: 0,
  };

  beforeEach(() => {
    clock = useFakeTimers({
      now: 1483228800000,
      toFake: ['Date', 'setTimeout', 'clearTimeout'],
    });
  });

  afterEach(() => {
    clock.restore();
    state.counter = 0;
  });

  it('correctly execute callback after timeout', () => {
    new Timer(() => {
      state.counter += 1;
    }, 1000).start();

    clock.tick(2000);

    expect(state.counter).to.eq(1);
  });

  it('correctly process pause and start again', () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start();

    clock.tick(500);

    expect(state.counter).to.eq(0, 'Still initial value, cause not enough time is passed — only 500ms');

    timer.pause();

    clock.tick(1000);

    expect(state.counter).to.eq(0, 'Still initial value, cause timer is on pause');

    timer.start();

    expect(state.counter).to.eq(
      0,
      'Still initial value, cause not enough time is passed — only 500ms and it is just a start after pause',
    );

    clock.tick(250);

    expect(state.counter).to.eq(0, 'Still initial value, cause not enough time is passed — only 750ms');

    clock.tick(300);

    expect(state.counter).to.eq(1);
  });

  it('correctly return time left after pause and start before and after reset', () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start();

    clock.tick(500);

    expect(state.counter).to.eq(0, 'Still initial value, cause not enough time is passed — only 500ms');
    expect(timer.getTimeLeft()).to.eq(500);

    timer.pause();

    clock.tick(500);

    expect(state.counter).to.eq(0, 'Still initial value, cause timer is on pause');
    expect(timer.getTimeLeft()).to.eq(500, 'It is still 500, cause timer is on pause');

    timer.start();

    clock.tick(250);

    expect(state.counter).to.eq(
      0,
      'Still initial value, cause not enough time is passed — only 750ms for timer',
    );
    expect(timer.getTimeLeft()).to.eq(250, 'It is 250, cause 750ms is passed for timer');

    clock.tick(300);
    expect(state.counter).to.eq(1);
    expect(timer.getTimeLeft()).to.eq(0, 'time left has to be 0, cause timer is finished');

    timer.start();
    expect(state.counter).to.eq(1, 'It has prev value, cause timer is started without reset');
    expect(timer.getTimeLeft()).to.eq(
      0,
      'time left has to be 0, cause timer is finished, and where is no reset',
    );

    clock.tick(1000);

    expect(state.counter).to.eq(1, 'It has prev value after 1000, cause timer is started without reset');
    expect(timer.getTimeLeft()).to.eq(
      0,
      'time left has to be 0 after 1000, cause timer is finished, and where is no reset',
    );

    timer.reset();
    timer.start();
    expect(state.counter).to.eq(1, 'It has prev value, cause timer is just started after reset');
    expect(timer.getTimeLeft()).to.eq(
      1000,
      'time left has to be initial value, cause timer is finished, and where is no reset',
    );

    clock.tick(1000);
    expect(state.counter).to.eq(2);
    expect(timer.getTimeLeft()).to.eq(
      0,
      'time left has to be 0 after next 1000ms after reset and start',
    );
  });

  it(`
    Timer should register only one setTimeout callback.
    It does not matter, how much we called start method during timer work`, () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start();
    timer.start();
    timer.start();
    timer.start();

    clock.tick(4000);

    expect(state.counter).to.eq(1);
  });

  it(`Timer will be called only one time during 1500ms, if it will be restarted in the middle`, () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start();

    clock.tick(500);

    // Now we start timeout again to execute callback after 1000ms
    timer.restart();

    clock.tick(700);

    expect(state.counter).to.eq(0);

    clock.tick(300);

    expect(state.counter).to.eq(1);
  });

  it(`
    Timer will execute callback and perform one more after timeout,
    if immediate option is passed to the start method`, () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start({
      immediate: true,
    });

    expect(state.counter).to.eq(1);

    clock.tick(1000);

    expect(state.counter).to.eq(2);
  });

  it('Timer will execute callback only one time during 3000ms, if timeout value will be changed', () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start();

    clock.tick(900);

    timer.setTimeoutAndRestart(2100);

    clock.tick(100);

    expect(state.counter).to.eq(0);

    clock.tick(2100);

    expect(state.counter).to.eq(1);
  });

  it('Several execution of method pause will pause timer only one time', () => {
    const timer = new Timer(() => {
      state.counter += 1;
    }, 1000);
    timer.start();
    timer.pause();
    timer.pause();
    timer.pause();

    clock.tick(1000);

    expect(state.counter).to.eq(0);

    timer.start();

    clock.tick(1000);

    expect(state.counter).to.eq(1);
  });
});
