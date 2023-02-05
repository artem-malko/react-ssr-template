import { v4 } from 'uuid';

import { Toast } from '../types';

type Subscriber = (toast: Toast) => void;

export class ToastController {
  private mutableSubscribers: Subscriber[] = [];

  public addToast = (toast: Omit<Toast, 'id'>) => {
    this.mutableSubscribers.forEach((subscriber) => {
      subscriber({
        ...toast,
        id: v4(),
      });
    });
  };

  public subscribeToAdd = (subscriber: Subscriber) => {
    this.mutableSubscribers.push(subscriber);

    const subscriberIndex = this.mutableSubscribers.length - 1;

    return () => {
      this.mutableSubscribers.splice(subscriberIndex, 1);
    };
  };
}
