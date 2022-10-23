import { Route, RouteWithoutParams, RouteWithParams } from '../types';

export const handle404Error = () => ({
  name: 'error404' as const,
});

export type TestsOnlyRootPage = {
  name: 'root';
};
export const testsOnlyRootPageRoute: Route<RouteWithoutParams, TestsOnlyRootPage> = {
  path: '/',
  mapURLToPage: () => ({ name: 'root' }),
};
export type TestsOnlyError404Page = {
  name: 'error404';
};
export const testsOnlyError404PageRoute: Route<RouteWithoutParams, TestsOnlyError404Page> = {
  path: '/error404',
  mapURLToPage: () => ({ name: 'error404' }),
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
  mapURLToPage: ({ id }) => ({
    name: 'pageWithRequiredParams',
    params: {
      id,
    },
  }),
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
  mapURLToPage: ({ id }, queryParams) => ({
    name: 'pageWithRequiredParamsWithQuery',
    params: {
      id: queryParams['query_param'] ? `${id}_query_param_${queryParams['query_param'].join('_')}` : id,
    },
  }),
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
  mapURLToPage: ({ id, name }) => ({
    name: 'pageWithNotRequiredParams',
    params: {
      id,
      name,
    },
  }),
};
