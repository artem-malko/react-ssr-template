import { Route, RouteWithoutParams, RouteWithParams, URLQueryParams } from '../types';

export const testsOnlyOpenPageAction = (payload: any) => ({
  type: 'openPage',
  payload,
});
export const testsOnlySetQueryStringParams = (payload: { params: URLQueryParams }) => ({
  type: 'setQueryStringParams',
  payload,
});
export const routerSignals = {
  onError404Action: testsOnlyOpenPageAction({
    name: 'error404',
    errorCode: 404,
  }),
  onError500Action: () =>
    testsOnlyOpenPageAction({
      name: 'error500',
      errorCode: 500,
    }),
  setQueryStringParams: testsOnlySetQueryStringParams,
};
export type TestsOnlyRootPage = {
  name: 'root';
};
export const testsOnlyRootPageRoute: Route<RouteWithoutParams, TestsOnlyRootPage> = {
  path: '/',
  signal: () => testsOnlyOpenPageAction({ name: 'root' }),
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
    return testsOnlyOpenPageAction({
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
    return testsOnlyOpenPageAction({
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
    return testsOnlyOpenPageAction({
      name: 'pageWithNotRequiredParams',
      params: {
        id,
        name,
      },
    });
  },
};
