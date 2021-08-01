import { expect } from 'chai';
import { createStore, AnyAction } from 'redux';
import { CreateCommonActionConstructor } from '..';
import { baseReducerForActionWithReducers, isActionWithReducers } from '../reducer';

describe('Action integration tests', () => {
  type Status = 'initial' | 'loading' | 'success' | 'error';
  interface State {
    data: {
      status: 'initial' | 'loading' | 'success' | 'error';
    };
  }

  function createActionConstructor<Payload extends Record<string, unknown> | undefined = undefined>(
    type: string,
  ) {
    return new CreateCommonActionConstructor<State, Payload>(type);
  }

  const changeStatusConstructor = createActionConstructor<{ status: Status }>('changeStatus');
  changeStatusConstructor.attachReducer('data', (s, action) => ({
    ...s,
    ...action.payload,
  }));
  const changeStatus = changeStatusConstructor.createActionCreator();

  const state: State = {
    data: {
      status: 'initial',
    },
  };
  const storeReducer = (curState: State | undefined = state, action: AnyAction) => {
    if (isActionWithReducers<State>(action)) {
      return baseReducerForActionWithReducers(curState, action);
    }

    return curState;
  };

  it('Change state after dispatching action with applicable reducer', () => {
    const store = createStore(storeReducer, state);

    store.dispatch(
      changeStatus({
        status: 'error',
      }),
    );

    expect(store.getState().data.status).to.eq('error');
  });
});
