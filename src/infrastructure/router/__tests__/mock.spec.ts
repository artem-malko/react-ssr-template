import { Route, RouteWithoutParams, RouteWithParams, URLQueryParams } from '../types';

export const openPage = (payload: any) => ({
  type: 'openPage',
  payload,
});
export const setQueryStringParams = (payload: { params: URLQueryParams }) => ({
  type: 'setQueryStringParams',
  payload,
});
export const routerSignals = {
  onError404Action: openPage({
    name: 'error404',
    errorCode: 404,
  }),
  setQueryStringParams,
};
export type RootPage = {
  name: 'root';
};
export const rootPageRoute: Route<RouteWithoutParams, RootPage> = {
  path: '/',
  signal: () => openPage({ name: 'root' }),
};

export type PageWithRequiredParams = {
  name: 'pageWithRequiredParams';
  params: {
    id: string;
  };
};
export const pageWithRequiredParamsRoute: Route<
  RouteWithParams<{ id: string }>,
  PageWithRequiredParams
> = {
  path: '/page_with_required_params/:id',
  signal: ({ id }) => {
    return openPage({
      name: 'pageWithRequiredParams',
      params: {
        id,
      },
    });
  },
};

export type PageWithRequiredParamsWithQuery = {
  name: 'pageWithRequiredParamsWithQuery';
  params: {
    id: string;
  };
};
export const pageWithRequiredParamsWithQueryRoute: Route<
  RouteWithParams<{ id: string }>,
  PageWithRequiredParamsWithQuery
> = {
  path: '/page_with_required_params_with_query/:id',
  signal: ({ id }, queryParams) => {
    return openPage({
      name: 'pageWithRequiredParamsWithQuery',
      params: {
        id: queryParams['query_param']
          ? `${id}_query_param_${queryParams['query_param'].join('_')}`
          : id,
      },
    });
  },
};

export type PageWithNotRequiredParams = {
  name: 'pageWithNotRequiredParams';
  params: {
    id: string;
    name?: string;
  };
};
export const pageWithNotRequiredParamsRoute: Route<
  RouteWithParams<{ id: string; name?: string }>,
  PageWithNotRequiredParams
> = {
  path: '/page_with_not_required_params/:id/:name?',
  signal: ({ id, name }) => {
    console.log;
    return openPage({
      name: 'pageWithNotRequiredParams',
      params: {
        id,
        name,
      },
    });
  },
};
