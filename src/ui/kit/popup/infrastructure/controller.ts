import { Popup } from '../types';

type Event =
  | {
      type: 'add';
      popup: Popup;
    }
  | {
      type: 'remove';
      popupId: string;
    }
  | {
      type: 'removeAll';
    };
type Subscriber = (event: Event) => void;

export class PopupController {
  private mutableSubscribers: Subscriber[] = [];

  public addPopup = (popup: Popup) => {
    this.mutableSubscribers.forEach((subscriber) => {
      subscriber({
        type: 'add',
        popup,
      });
    });
  };

  public removePopupById = (popupId: string) => {
    this.mutableSubscribers.forEach((subscriber) => {
      subscriber({
        type: 'remove',
        popupId,
      });
    });
  };

  public removeAll = () => {
    this.mutableSubscribers.forEach((subscriber) => {
      subscriber({
        type: 'removeAll',
      });
    });
  };

  // Do not need to have unsubscribe, cause it will subscribe for the whole app life
  public subscribeToChanges = (subscriber: Subscriber) => {
    // eslint-disable-next-line
    this.mutableSubscribers.push(subscriber);

    const subscriberIndex = this.mutableSubscribers.length - 1;

    return () => {
      this.mutableSubscribers.splice(subscriberIndex, 1);
    };
  };
}
