import { AnyAppState, URLQueryParams } from '../../types';
import { OpenAnyPageActionType } from '../actions/appContext/openPageAction';
import { SetQueryStringParamsActionType } from '../actions/appContext/setQueryStringParams';
import { replaceState } from '../actions/router';

type Action = OpenAnyPageActionType | SetQueryStringParamsActionType | ReturnType<typeof replaceState>;

export const createReducer = (initialState: AnyAppState) => {
  return (state: AnyAppState | undefined, action: Action): AnyAppState => {
    console.log('ROUTER ACTION: ', action);
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
        const queryParams = action.payload;

        if (!queryParams) {
          return {
            ...state,
            appContext: {
              ...state.appContext,
              URLQueryParams: undefined,
            },
          };
        }

        const mutableQueryParams: URLQueryParams = {};

        if ('utm_media' in queryParams && queryParams['utm_media']) {
          mutableQueryParams['utm_media'] = queryParams['utm_media'];
        }

        if ('utm_source' in queryParams && queryParams['utm_source']) {
          mutableQueryParams['utm_source'] = queryParams['utm_source'];
        }

        // @JUST_FOR_TEST JUST FOR TEST
        if ('test_mode_attr' in queryParams && queryParams['test_mode_attr']) {
          mutableQueryParams['test_mode_attr'] = queryParams['test_mode_attr'];
        }

        // @JUST_FOR_TEST JUST FOR TEST
        if ('render' in queryParams && queryParams['render']) {
          mutableQueryParams['render'] = queryParams['render'];
        }

        return {
          ...state,
          appContext: {
            ...state.appContext,
            URLQueryParams: mutableQueryParams,
          },
        };
      }
      default: {
        return state;
      }
    }
  };
};
