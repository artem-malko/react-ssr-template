import { AnyAction } from 'redux';
import { Action } from '.';

export const isActionWithReducers = <S>(action: AnyAction): action is Action<string, any, S> =>
  action.reducers && action.reducers.length > 0;

export const baseReducerForActionWithReducers = <S>(state: S, action: Action<string, any, S>): S => {
  return action.reducers.reduce<S>((nextState, reducerParams) => {
    const newStateForBranch = reducerParams.reducer(nextState[reducerParams.branch], action);

    if (newStateForBranch === nextState[reducerParams.branch]) {
      return nextState;
    }

    return {
      ...nextState,
      [reducerParams.branch]: newStateForBranch,
    };
  }, state);
};
