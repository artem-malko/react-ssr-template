import { Toast } from '../types';

type Subscriber = (toast: Toast) => void;

export class ToastController {
  private mutableSubscribers: Subscriber[] = [];

  public addToast = (toast: Toast) => {
    this.mutableSubscribers.forEach((subscriber) => {
      subscriber(toast);
    });
  };

  public subscribeToAdd = (subscriber: Subscriber) => {
    this.mutableSubscribers.push(subscriber);
  };
}
