import { Selector } from 'react-redux';
import { UnknownAction } from 'redux';

export type SignalActionWithActionInPayload = UnknownAction & {
  payload: UnknownAction;
};

export type SignalActionWithActionsInPayload = UnknownAction & {
  payload: UnknownAction[];
};

export type SignalActionWithSelectorsInPayload = UnknownAction & {
  selectors: Record<string, Selector<any, any>>;
  payload: (params: Record<string, any>) => UnknownAction;
};
