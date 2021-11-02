/**
 * Timer is a timeout, which can be paused, restarted and can be launched with some period
 */
export class Timer {
  private timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
  private isRunning = false;
  private startedMilisecondsAgo = 0;
  private remaining = 0;

  constructor(private callback: () => void, private initialTimeoutValue: number) {
    this.remaining = initialTimeoutValue;
  }

  /**
   * Reset timer to initial values and start again
   */
  public restart(params?: { immediate?: boolean }) {
    this.reset();
    this.start(params);
  }

  /**
   * Perform callback execution after timeout
   * Calback can be executed immediately, if immediate is passed and equal to true
   */
  public start(params?: { immediate?: boolean }) {
    if (this.isRunning || !this.remaining) {
      return;
    }

    this.isRunning = true;
    this.startedMilisecondsAgo = Date.now();
    this.timeoutId = setTimeout(() => {
      this.timeoutId = undefined;
      this.isRunning = false;
      this.remaining = 0;

      this.callback();
    }, this.remaining);

    if (params?.immediate) {
      this.callback();
    }
  }

  /**
   * Pause current timer
   */
  public pause() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.remaining -= Date.now() - this.startedMilisecondsAgo;
  }

  /**
   * Stopped timer and reset all values to initial
   */
  public reset() {
    this.isRunning = false;
    this.startedMilisecondsAgo = 0;
    this.remaining = this.initialTimeoutValue;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  /**
   * Return time left to the moment, than callback will be executed
   */
  public getTimeLeft() {
    if (this.isRunning) {
      this.pause();
      this.start();
    }

    return this.remaining;
  }

  /**
   * Restart timer with new timeout
   */
  public setTimeoutAndRestart(timeout: number) {
    this.initialTimeoutValue = timeout;
    this.restart();
  }
}
