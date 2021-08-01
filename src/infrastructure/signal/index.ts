import { AnyAction } from 'redux';
import {
  SIGNAL_ACTION,
  SEQUENCE_ACTION,
  PARALLEL_ACTION,
  WITH_SELECTORS_ACTION,
  NOOP_ACTION,
} from './constants';

interface SignalDescriptor<P> {
  type: typeof SIGNAL_ACTION;
  payload: AnyAction;
  name: string;
  params: P;
}
/**
 * Wrap sequence or simple action with signal, which has it is own name and params
 *
 * @example
 * const signal = createSignal('signalName', (params: { id: string }) => sequence(action1(id), action2(id));
 *
 * disaptch(signal({ id: 'uuid' }));
 *
 */
export function createSignal(name: string, getAction: () => AnyAction): () => SignalDescriptor<void>;
export function createSignal<T extends any>(
  name: string,
  getAction: (params: T) => AnyAction,
): (params: T) => SignalDescriptor<T>;
export function createSignal<T extends any>(name: string, getAction: (params: T) => AnyAction) {
  return (params: T) => ({
    type: SIGNAL_ACTION,
    payload: getAction(params),
    name,
    params,
  });
}

/**
 * Run actions one after another.
 * If one of actions is an promise — sequence will wait, when it will be resovled, then start next action
 *
 * @example
 * const sequenceAction = sequence(action1(), action2());
 */
export const sequence = (...actions: AnyAction[]) => ({
  type: SEQUENCE_ACTION,
  payload: actions,
});

/**
 * Run actions in parallel mode.
 *
 * @example
 * const parallelAction = parallel(action1(), action2());
 */
export const parallel = (...actions: AnyAction[]) => ({
  type: PARALLEL_ACTION,
  payload: actions,
});

/**
 * Used when you need to get data from state to pass it to action as params.
 * State has any type here. You can specify it in your app:
 *
 * @example
 * const withSelectorsAction = commonWithSelectors({ id: (state: AppState) => state.id }, ({ id }) => {
 *   return someAction({ id });
 * });
 *
 * @example
 * // You can create withSelectors with specified state type
 * const withSelectors = <S extends { [key: string]: (state: AppState) => any }>(
 *   selectors: S,
 *   payload: (params: { [key in keyof S]: ReturnType<S[key]> }) => AnyAction,
 * ) => commonWithSelectors(selectors, payload);
 *
 * // You do not need to specify state type, cause it is already bound
 * const withSelectorsAction = withSelectors({ id: (state) => state.id }, ({ id }) => {
 *   return someAction({ id });
 * });
 */
export const commonWithSelectors = <S extends { [key: string]: (state: any) => any }>(
  selectors: S,
  payload: (params: { [key in keyof S]: ReturnType<S[key]> }) => AnyAction,
) => ({
  type: WITH_SELECTORS_ACTION,
  payload,
  selectors,
});

/**
 * Dispatch this action in signals, when you do not have any actions to dispatch.
 * Noop action will not be passed to reducers
 *
 * @example
 * const condition = true;
 * const sequenceAction = sequence(condition ? action() : noop());
 */
export const noop = () => ({
  type: NOOP_ACTION,
});
