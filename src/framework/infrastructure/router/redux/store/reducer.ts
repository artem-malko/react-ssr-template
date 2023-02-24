import { AnyAppState } from '../../types';
import { OpenAnyPageActionType } from '../actions/appContext/openPageAction';
import { SetQueryStringParamsActionType } from '../actions/appContext/setQueryStringParams';
import { replaceState } from '../actions/router';

type Action = OpenAnyPageActionType | SetQueryStringParamsActionType | ReturnType<typeof replaceState>;

export const createReducer = (initialState: AnyAppState) => {
  return (state: AnyAppState | undefined, action: Action): AnyAppState => {
    if (!state) {
      return initialState;
    }

    switch (action.type) {
      case 'replaceState': {
        return {
          ...state,
          ...action.payload,
        };
      }
      case 'openPageAction': {
        return {
          ...state,
          appContext: {
            ...state.appContext,
            page: action.payload,
          },
        };
      }
      case 'setQueryStringParamsAction': {
        return {
          ...state,
          appContext: {
            ...state.appContext,
            URLQueryParams: action.payload,
          },
        };
      }
      default: {
        return state;
      }
    }
  };
};
