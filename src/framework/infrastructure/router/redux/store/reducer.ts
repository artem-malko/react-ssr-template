import { AnyAppState, URLQueryParams } from '../../types';
import { OpenAnyPageActionType } from '../actions/appContext/openPageAction';
import { SetQueryStringParamsActionType } from '../actions/appContext/setQueryStringParams';
import { replaceState } from '../actions/router';

type Action = OpenAnyPageActionType | SetQueryStringParamsActionType | ReturnType<typeof replaceState>;
export type CreateReducerOptions = {
  allowedURLQueryKeys?: readonly string[];
};

export const createReducer = (initialState: AnyAppState, options: CreateReducerOptions) => {
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
        let mutableQueryStringParams: URLQueryParams<string> = {};

        if (options.allowedURLQueryKeys && options.allowedURLQueryKeys.length) {
          const payloadKeys = Object.keys(action.payload);

          mutableQueryStringParams = payloadKeys.reduce<URLQueryParams<string>>((mutableRes, key) => {
            const queryParamsFromPayload = action.payload[key];

            if (options.allowedURLQueryKeys?.includes(key) && queryParamsFromPayload) {
              mutableRes[key] = queryParamsFromPayload;
            }

            return mutableRes;
          }, {});
        } else {
          mutableQueryStringParams = action.payload;
        }

        return {
          ...state,
          appContext: {
            ...state.appContext,
            URLQueryParams: mutableQueryStringParams,
          },
        };
      }
      default: {
        return state;
      }
    }
  };
};
