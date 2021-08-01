import { expect } from 'chai';
import { applyMiddleware, createStore, compose, StoreEnhancer, AnyAction } from 'redux';
import { createSignalMiddleware } from '../middleware';
import { sequence, parallel, commonWithSelectors, createSignal, noop } from '..';
import { waitForResolve } from 'infrastructure/tests/utils/wait';

describe('Siglan integration tests', () => {
  interface State {
    status: string;
  }
  const state: State = {
    status: 'initial',
  };
  const appliedMiddlewares = applyMiddleware(createSignalMiddleware());
  const finalEnhancer = compose.apply(undefined, [appliedMiddlewares]);

  it('Return sequence action with two actions inside. Run actions one after another', async () => {
    const actions: AnyAction[] = [];
    const reducer = (s: State = state, a: AnyAction) => {
      switch (a.type) {
        case 'sequence1':
        case 'sequence2':
          actions.push(a);
      }

      return s;
    };
    const store = createStore(reducer, state, finalEnhancer as StoreEnhancer<State>);

    const action1 = {
      type: 'sequence1',
    };
    const action2 = {
      type: 'sequence2',
    };
    const expected = {
      type: 'INTERNAL/ACTION_SEQUENCE',
      payload: [action1, action2],
    };
    const sequenceAction = sequence(action1, action2);

    expect(sequenceAction).to.deep.eq(expected);

    await waitForResolve(() => store.dispatch(sequenceAction));

    expect(actions).to.deep.eq([action1, action2]);
  });

  it('Return parallel action with two actions inside. Run actions in parallel', async () => {
    const actions: AnyAction[] = [];
    const reducer = (s: State = state, a: AnyAction) => {
      switch (a.type) {
        case 'parallel1':
        case 'parallel2':
          actions.push(a);
      }

      return s;
    };
    const store = createStore(reducer, state, finalEnhancer as StoreEnhancer<State>);

    const action1 = {
      type: 'parallel1',
    };
    const action2 = {
      type: 'parallel2',
    };
    const expected = {
      type: 'INTERNAL/ACTION_PARALLEL',
      payload: [action1, action2],
    };

    const parallelAction = parallel(action1, action2);
    expect(parallelAction).to.deep.eq(expected);

    await waitForResolve(() => store.dispatch(parallelAction));

    expect(actions).to.deep.eq([action1, action2]);
  });

  it('Return withSelectors action. Apply action to store', async () => {
    const reducer = (s: State = state, a: AnyAction) => {
      switch (a.type) {
        case 'withSelectors':
          return {
            ...s,
            status: 'withSelectors',
          };
        default:
          return s;
      }
    };
    const store = createStore(reducer, state, finalEnhancer as StoreEnhancer<State>);

    const actionCreator = (s: string) => ({
      type: 'withSelectors',
      payload: s,
    });
    const withSelectorsAction = commonWithSelectors(
      {
        status: (ss) => ss.status,
      },
      ({ status }) => {
        return actionCreator(status);
      },
    );

    expect(withSelectorsAction.type).to.eq('INTERNAL/ACTION_WITH_SELECTORS');
    store.dispatch(withSelectorsAction);
    expect(store.getState().status).to.eq('withSelectors');
  });

  it('Return signal action. Apply action to store', () => {
    const reducer = (s: State = state, a: AnyAction) => {
      switch (a.type) {
        case 'inSignal':
          return {
            ...s,
            status: 'inSignal',
          };
        default:
          return s;
      }
    };
    const store = createStore(reducer, state, finalEnhancer as StoreEnhancer<State>);
    const action = {
      type: 'inSignal',
    };
    const expected = {
      type: 'INTERNAL/ACTION_SIGNAL',
      payload: action,
      name: 'signalName',
      params: {
        param: 'param',
      },
    };
    const signalAction = createSignal(
      'signalName',
      (_params: { param: 'param' }) => action,
    )({
      param: 'param',
    });

    expect(signalAction).to.deep.eq(expected);
    store.dispatch(signalAction);
    expect(store.getState().status).to.eq('inSignal');
  });

  it('store is not changed after noop action, noop action is not passed to reducers', () => {
    const actionsPassedToReducers: AnyAction[] = [];
    const reducer = (s: State = state, a: AnyAction) => {
      actionsPassedToReducers.push(a);
      switch (a.type) {
        case 'INTERNAL/ACTION_NOOP':
          return {
            ...s,
            status: 'INTERNAL/ACTION_NOOP',
          };
        default:
          return s;
      }
    };
    const store = createStore(reducer, state, finalEnhancer as StoreEnhancer<State>);
    expect(store.getState().status).to.eq('initial');
    store.dispatch(noop());
    // Check, that noop action is not passed to reducers
    expect(store.getState().status).to.eq('initial');
    // 1 cause redux emit initial action on start
    expect(actionsPassedToReducers.length).to.eq(1);
  });
});
