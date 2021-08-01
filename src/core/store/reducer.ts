import { AnyAction, combineReducers } from 'redux';
import { AppContext, AppState } from './types';
import { baseReducerForActionWithReducers, isActionWithReducers } from 'infrastructure/actions/reducer';

const initialReducer =
  <S>(defaultState: S) =>
  (state: S | undefined = defaultState, _action: AnyAction) =>
    state;
const combReducer = combineReducers<AppState>({
  appContext: initialReducer<AppContext>({
    page: {
      name: 'root',
    },
    URLQueryParams: undefined,
  }),
});

export function mainReducer(state: AppState | undefined, action: AnyAction): AppState {
  if (action.type === 'replaceState') {
    return {
      ...state,
      ...action.payload,
    };
  }

  // Handle initial undefined state
  if (!state) {
    return combReducer(state, action);
  }

  // Handle actions with reducers
  if (isActionWithReducers<AppState>(action)) {
    return baseReducerForActionWithReducers(state, action);
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('Unhandled action: ', action);
  }

  return state;
}
