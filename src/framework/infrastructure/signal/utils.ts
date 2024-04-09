import { UnknownAction, isAction } from 'redux';

import {
  SignalActionWithActionInPayload,
  SignalActionWithActionsInPayload,
  SignalActionWithSelectorsInPayload,
} from './types';

export function isSignalActionWithActionInPayload(
  action: UnknownAction,
): action is SignalActionWithActionInPayload {
  return 'payload' in action && isAction(action.payload);
}

export function isSignalActionWithActionsInPayload(
  action: UnknownAction,
): action is SignalActionWithActionsInPayload {
  return 'payload' in action && Array.isArray(action.payload);
}

export function isSignalActionWithSelectorsInPayload(
  action: UnknownAction,
): action is SignalActionWithSelectorsInPayload {
  return 'payload' in action && 'selectors' in action;
}
