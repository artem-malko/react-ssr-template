import { expect } from 'chai';

import { createURLCompiler } from '../compileURL';
import { Route, RouteWithParams } from '../types';
import {
  pageWithNotRequiredParamsRoute,
  PageWithRequiredParams,
  pageWithRequiredParamsRoute,
  PageWithRequiredParamsWithQuery,
  pageWithRequiredParamsWithQueryRoute,
  testsOnlyRootPageRoute,
} from './mock.spec';

describe('Routing compile URL', () => {
  it('returns / for the root page', () => {
    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
    });

    const appContext = {
      page: {
        name: 'root',
      },
      URLQueryParams: undefined,
    };
    const result = '/';

    expect(compileURL(appContext)).to.eq(result);
  });

  it('returns / for any unknown page, prevent runtime errors', () => {
    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
    });

    const appContext = {
      page: {
        name: 'root2' as 'root',
      },
      URLQueryParams: undefined,
    };
    const result = '/';

    expect(compileURL(appContext)).to.eq(result);
  });

  it('returns correct path for a page with params (usage of the default mapPageToPathParams)', () => {
    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
      pageWithRequiredParams: pageWithRequiredParamsRoute,
    });

    const appContext = {
      page: {
        name: 'pageWithRequiredParams',
        params: {
          id: '100',
        },
      },
      URLQueryParams: undefined,
    };
    const result = '/page_with_required_params/100';

    expect(compileURL(appContext)).to.eq(result);
  });

  it('returns correct path for a page with params (usage of the custom mapPageToPathParams)', () => {
    const pageWithRequiredParamsRouteWithPageToPathPatcher: Route<
      RouteWithParams<{ id: string }>,
      PageWithRequiredParams
    > = {
      ...pageWithRequiredParamsRoute,
      mapPageToPathParams: ({ id }) => {
        return {
          id: `${id}_${id}`,
        };
      },
    };

    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
      pageWithRequiredParams: pageWithRequiredParamsRouteWithPageToPathPatcher,
    });

    const appContext = {
      page: {
        name: 'pageWithRequiredParams',
        params: {
          id: '100',
        },
      },
      URLQueryParams: undefined,
    };
    const result = '/page_with_required_params/100_100';

    expect(compileURL(appContext)).to.eq(result);
  });

  it(`returns correct path for a page with required params and not required params
      (usage of the default mapPageToPathParams, a not required param is undefiend)`, () => {
    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
      pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
    });
    const appContext = {
      page: {
        name: 'pageWithNotRequiredParams',
        params: {
          id: '100',
        },
      },
      URLQueryParams: undefined,
    };
    const result = '/page_with_not_required_params/100';

    expect(compileURL(appContext)).to.eq(result);
  });

  it('returns correct path for a page with defiend mapPageToQueryParams function', () => {
    const pageWithRequiredParamsRouteWithPageToQueryPatcher: Route<
      RouteWithParams<{ id: string }>,
      PageWithRequiredParamsWithQuery
    > = {
      ...pageWithRequiredParamsWithQueryRoute,
      mapPageToQueryParams: ({ id }) => {
        return {
          query_param: [`${id}_${id}`],
        };
      },
    };

    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
      pageWithRequiredParamsWithQuery: pageWithRequiredParamsRouteWithPageToQueryPatcher,
    });

    const appContext = {
      page: {
        name: 'pageWithRequiredParamsWithQuery',
        params: {
          id: '100',
        },
      },
      URLQueryParams: undefined,
    };
    const result = '/page_with_required_params_with_query/100?query_param=100_100';

    expect(compileURL(appContext)).to.eq(result);
  });

  it(`returns correct path for a page with defiend mapPageToQueryParams function
      (a query param without value)`, () => {
    const pageWithRequiredParamsRouteWithPageToQueryPatcher: Route<
      RouteWithParams<{ id: string }>,
      PageWithRequiredParamsWithQuery
    > = {
      ...pageWithRequiredParamsWithQueryRoute,
      mapPageToQueryParams: () => {
        return {
          query_param: [''],
        };
      },
    };

    const compileURL = createURLCompiler({
      root: testsOnlyRootPageRoute,
      pageWithRequiredParamsWithQuery: pageWithRequiredParamsRouteWithPageToQueryPatcher,
    });

    const appContext = {
      page: {
        name: 'pageWithRequiredParamsWithQuery',
        params: {
          id: '100',
        },
      },
      URLQueryParams: undefined,
    };
    const result = '/page_with_required_params_with_query/100?query_param';

    expect(compileURL(appContext)).to.eq(result);
  });
});
