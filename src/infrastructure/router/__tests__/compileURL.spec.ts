import { expect } from 'chai';
import {
  pageWithNotRequiredParamsRoute,
  pageWithRequiredParamsRoute,
  pageWithRequiredParamsWithQueryRoute,
  rootPageRoute,
} from './mock.spec';
import { createURLCompiler } from '../compileURL';

describe('Routing compile URL', () => {
  it('returns / for the root page', () => {
    const compileURL = createURLCompiler({
      root: rootPageRoute,
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

  it('returns correct path for a page with params (usage of the default matchPageToPathParams)', () => {
    const compileURL = createURLCompiler({
      root: rootPageRoute,
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

  it('returns correct path for a page with params (usage of the custom matchPageToPathParams)', () => {
    const compileURL = createURLCompiler({
      root: rootPageRoute,
      pageWithRequiredParams: {
        ...pageWithRequiredParamsRoute,
        matchPageToPathParams: ({ id }) => {
          return {
            id: `${id}_${id}`,
          };
        },
      },
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
      (usage of the default matchPageToPathParams, a not required param is undefiend)`, () => {
    const compileURL = createURLCompiler({
      root: rootPageRoute,
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

  it('returns correct path for a page with defiend matchPageToQueryParams function', () => {
    const compileURL = createURLCompiler({
      root: rootPageRoute,
      pageWithRequiredParamsWithQuery: {
        ...pageWithRequiredParamsWithQueryRoute,
        matchPageToQueryParams: ({ id }) => {
          return {
            query_param: [`${id}_${id}`],
          };
        },
      },
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

  it(`returns correct path for a page with defiend matchPageToQueryParams function
      (a query param withour value)`, () => {
    const compileURL = createURLCompiler({
      root: rootPageRoute,
      pageWithRequiredParamsWithQuery: {
        ...pageWithRequiredParamsWithQueryRoute,
        matchPageToQueryParams: () => {
          return {
            query_param: [''],
          };
        },
      },
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
