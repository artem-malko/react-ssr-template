import { expect } from 'chai';
import { createURLParser } from '../parseURL';
import { Routes } from '../types';
import {
  openPage,
  RootPage,
  rootPageRoute,
  PageWithRequiredParams,
  pageWithRequiredParamsRoute,
  PageWithNotRequiredParams,
  pageWithNotRequiredParamsRoute,
  PageWithRequiredParamsWithQuery,
  pageWithRequiredParamsWithQueryRoute,
  routerSignals,
} from './mock.spec';

describe('parse URL', () => {
  it('returns the root page opening signal the empty URL', () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
      } as Routes<RootPage>,
      routerSignals,
    );
    const URL = '';
    const result = [openPage({ name: 'root' })];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the root page opening signal for the correct root URL', () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
      } as Routes<RootPage>,
      routerSignals,
    );
    const URL = '/';
    const result = [openPage({ name: 'root' })];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the root page opening signal for the root URL with trailing slashes', () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
      } as Routes<RootPage>,
      routerSignals,
    );
    const URL = '///';
    const result = [openPage({ name: 'root' })];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the 404 page signal for any unsupported URL', () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
      } as Routes<RootPage>,
      routerSignals,
    );
    const URL = '/unsupported_url';
    const result = [
      openPage({
        name: 'error404',
        errorCode: 404,
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns a page with required params opening signal for the correct URL', () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithRequiredParams: pageWithRequiredParamsRoute,
      } as Routes<RootPage | PageWithRequiredParams>,
      routerSignals,
    );
    const URL = '/page_with_required_params/100';
    const result = [
      openPage({
        name: 'pageWithRequiredParams',
        params: {
          id: '100',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with required params opening signal for the correct URL.
      The page path has no leading slash`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithRequiredParams: pageWithRequiredParamsRoute,
      } as Routes<RootPage | PageWithRequiredParams>,
      routerSignals,
    );
    const URL = 'page_with_required_params/100';
    const result = [
      openPage({
        name: 'pageWithRequiredParams',
        params: {
          id: '100',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with required params opening signal for the correct URL.
      The page path in route config has no leading slash`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithRequiredParams: {
          ...pageWithRequiredParamsRoute,
          path: pageWithRequiredParamsRoute.path.substring(1),
        },
      } as Routes<RootPage | PageWithRequiredParams>,
      routerSignals,
    );
    const URL = '/page_with_required_params/100';
    const result = [
      openPage({
        name: 'pageWithRequiredParams',
        params: {
          id: '100',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with required params opening signal for the correct URL.
      The page param depends on query string and the path too`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithRequiredParamsWithQuery: pageWithRequiredParamsWithQueryRoute,
      } as Routes<RootPage | PageWithRequiredParamsWithQuery>,
      routerSignals,
    );
    const URL = 'page_with_required_params_with_query/100?query_param=query_value';
    const result = [
      {
        type: 'setQueryStringParams',
        payload: {
          params: {
            query_param: ['query_value'],
          },
        },
      },
      openPage({
        name: 'pageWithRequiredParamsWithQuery',
        params: {
          id: '100_query_param_query_value',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with required params opening signal for the correct URL.
      The page param depends on query string and the path too and query param has no value`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithRequiredParamsWithQuery: pageWithRequiredParamsWithQueryRoute,
      } as Routes<RootPage | PageWithRequiredParamsWithQuery>,
      routerSignals,
    );
    const URL = 'page_with_required_params_with_query/100?query_param';
    const result = [
      {
        type: 'setQueryStringParams',
        payload: {
          params: {
            query_param: [''],
          },
        },
      },
      openPage({
        name: 'pageWithRequiredParamsWithQuery',
        params: {
          id: '100_query_param_',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with required params opening signal for the correct URL.
      The page param depends on query string and the path too
      and query param has multiple values`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithRequiredParamsWithQuery: pageWithRequiredParamsWithQueryRoute,
      } as Routes<RootPage | PageWithRequiredParamsWithQuery>,
      routerSignals,
    );
    const URL =
      'page_with_required_params_with_query/100?query_param=query_value1&query_param=query_value2';
    const result = [
      {
        type: 'setQueryStringParams',
        payload: {
          params: {
            query_param: ['query_value1', 'query_value2'],
          },
        },
      },
      openPage({
        name: 'pageWithRequiredParamsWithQuery',
        params: {
          id: '100_query_param_query_value1_query_value2',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with not required params opening signal for the correct URL.
      The not required param is not passed in the URL`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
      } as Routes<RootPage | PageWithNotRequiredParams>,
      routerSignals,
    );
    const URL = '/page_with_not_required_params/100';
    const result = [
      openPage({
        name: 'pageWithNotRequiredParams',
        params: {
          id: '100',
          name: undefined,
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with not required params opening signal for the correct URL.
      The not required param is passed in the URL`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
      } as Routes<RootPage | PageWithNotRequiredParams>,
      routerSignals,
    );
    const URL = '/page_with_not_required_params/100/Ann';
    const result = [
      openPage({
        name: 'pageWithNotRequiredParams',
        params: {
          id: '100',
          name: 'Ann',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it(`returns a page with not required params opening signal for the correct URL.
      The not required param is passed in the URL and it is decoded correctly`, () => {
    const parseURL = createURLParser(
      {
        root: rootPageRoute,
        pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
      } as Routes<RootPage | PageWithNotRequiredParams>,
      routerSignals,
    );
    const URL = '/page_with_not_required_params/100/caf%C3%A9';
    const result = [
      openPage({
        name: 'pageWithNotRequiredParams',
        params: {
          id: '100',
          name: 'café',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });
});
