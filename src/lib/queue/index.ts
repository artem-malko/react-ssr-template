type Action<P> = (payload: P) => Promise<any>;
interface QueueParams<P> {
  action: Action<P>;
  timeout?: number;
  onErrorAction?: (error: Error, payload: P) => void;
}

export class Queue<P> {
  private mutableQueue: P[] = [];
  private action: Action<P>;
  private timeout: number | undefined;
  private onErrorAction?: (error: Error, payload: P) => void;
  private mutableIsBusy = false;

  constructor(params: QueueParams<P>) {
    this.action = params.action;
    this.timeout = params.timeout;
    this.onErrorAction = params.onErrorAction;
  }

  public addToQueue(jobPayload: P) {
    this.mutableQueue.push(jobPayload);
    this.startQueue();
  }

  private startQueue() {
    this.doNextJob();
  }

  private doNextJob() {
    if (this.mutableIsBusy) {
      return;
    }

    this.mutableIsBusy = true;

    const nextJobPayload = this.mutableQueue.shift();

    if (!nextJobPayload) {
      this.mutableIsBusy = false;
      return;
    }

    if (!this.timeout) {
      this.doWork(nextJobPayload);
      return;
    }

    setTimeout(() => {
      this.doWork(nextJobPayload);
    }, this.timeout);
  }

  private doWork(jobPayload: P) {
    this.action(jobPayload)
      .then(() => {
        this.mutableIsBusy = false;
        this.doNextJob();
      })
      .catch((rawError) => {
        if (this.onErrorAction) {
          const error = rawError instanceof Error ? rawError : new Error(rawError);
          this.onErrorAction(error, jobPayload);
        }

        this.mutableIsBusy = false;
        this.doNextJob();
      });
  }
}
