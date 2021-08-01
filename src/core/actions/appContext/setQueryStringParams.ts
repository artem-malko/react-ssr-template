import { URLQueryParams } from 'infrastructure/router/types';
import { createActionConstructor } from '../createActionConstructor';

export const setQueryStringParams = createActionConstructor<{ params: URLQueryParams }>(
  'setQueryStringParams',
)
  .attachReducer('appContext', (state, action) => {
    const queryParams = action.payload.params;
    const mutableQueryParams: URLQueryParams = {};

    if ('utm_media' in queryParams && queryParams['utm_media']) {
      mutableQueryParams['utm_media'] = queryParams['utm_media'];
    }

    if ('utm_source' in queryParams && queryParams['utm_source']) {
      mutableQueryParams['utm_source'] = queryParams['utm_source'];
    }

    // @JUST_FOR_TEST JUST FOR TEST
    if ('strict' in queryParams && queryParams['strict']) {
      mutableQueryParams['strict'] = queryParams['strict'];
    }

    // @JUST_FOR_TEST JUST FOR TEST
    if ('render' in queryParams && queryParams['render']) {
      mutableQueryParams['render'] = queryParams['render'];
    }

    return {
      ...state,
      URLQueryParams: mutableQueryParams,
    };
  })
  .createActionCreator();
