import { expect } from 'chai';

import { createURLParser } from '../parseURL';
import { openAnyPageAction } from '../redux/actions/appContext/openPageAction';
import { Route, RouteWithoutParams, RouteWithParams } from '../types';
import {
  testsOnlyRootPageRoute,
  pageWithRequiredParamsRoute,
  pageWithNotRequiredParamsRoute,
  pageWithRequiredParamsWithQueryRoute,
  handle404Error,
  testsOnlyError404PageRoute,
} from './mock.spec';

describe('parse URL', () => {
  it('returns the root page opening signal the empty URL', () => {
    const parseURL = createURLParser<'root' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '';
    const result = [openAnyPageAction({ name: 'root' })];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the root page opening signal for the correct root URL', () => {
    const parseURL = createURLParser<'root' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/';
    const result = [openAnyPageAction({ name: 'root' })];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the root page opening signal for the root URL with trailing slashes', () => {
    const parseURL = createURLParser<'root' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '///';
    const result = [openAnyPageAction({ name: 'root' })];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the 404 page signal for an unsupported URL with unknown main slug', () => {
    const parseURL = createURLParser<'root' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/unsupported_url';
    const result = [
      openAnyPageAction({
        name: 'error404',
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns the 404 page signal for an unsupported URL with known main slug', () => {
    const parseURL = createURLParser<'root' | 'pageWithRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParams: pageWithRequiredParamsRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/page_with_required_params';
    const result = [
      openAnyPageAction({
        name: 'error404',
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  it('returns a page with required params opening signal for the correct URL', () => {
    const parseURL = createURLParser<'root' | 'pageWithRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParams: pageWithRequiredParamsRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/page_with_required_params/100';
    const result = [
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParams: pageWithRequiredParamsRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = 'page_with_required_params/100';
    const result = [
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParams: {
          ...pageWithRequiredParamsRoute,
          path: pageWithRequiredParamsRoute.path.substring(1),
        },
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });

    const URL = '/page_with_required_params/100';
    const result = [
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithRequiredParamsWithQuery' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParamsWithQuery: pageWithRequiredParamsWithQueryRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = 'page_with_required_params_with_query/100?query_param=query_value';
    const result = [
      {
        type: 'setQueryStringParamsAction',
        payload: {
          query_param: ['query_value'],
        },
      },
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithRequiredParamsWithQuery' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParamsWithQuery: pageWithRequiredParamsWithQueryRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = 'page_with_required_params_with_query/100?query_param';
    const result = [
      {
        type: 'setQueryStringParamsAction',
        payload: {
          query_param: [''],
        },
      },
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithRequiredParamsWithQuery' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithRequiredParamsWithQuery: pageWithRequiredParamsWithQueryRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL =
      'page_with_required_params_with_query/100?query_param=query_value1&query_param=query_value2';
    const result = [
      {
        type: 'setQueryStringParamsAction',
        payload: {
          query_param: ['query_value1', 'query_value2'],
        },
      },
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithNotRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/page_with_not_required_params/100';
    const result = [
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithNotRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/page_with_not_required_params/100/Ann';
    const result = [
      openAnyPageAction({
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
    const parseURL = createURLParser<'root' | 'pageWithNotRequiredParams' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        pageWithNotRequiredParams: pageWithNotRequiredParamsRoute,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });
    const URL = '/page_with_not_required_params/100/caf%C3%A9';
    const result = [
      openAnyPageAction({
        name: 'pageWithNotRequiredParams',
        params: {
          id: '100',
          name: 'café',
        },
      }),
    ];

    expect(parseURL(URL)).to.deep.eq(result);
  });

  describe('routes with a similar prefix', () => {
    const parseURL = createURLParser<'root' | 'items' | 'itemsById' | 'error404'>({
      routes: {
        root: testsOnlyRootPageRoute,
        items: {
          path: '/items',
          mapURLParamsToPage: () => ({
            name: 'items',
          }),
        } as Route<RouteWithoutParams, { name: 'items' }>,
        itemsById: {
          path: '/items/:id',
          mapURLParamsToPage: ({ id }) => ({
            name: 'itemsById',
            params: {
              id,
            },
          }),
        } as Route<RouteWithParams<{ id: string }>, { name: 'itemsById'; params: { id: string } }>,
        error404: testsOnlyError404PageRoute,
      },
      handle404Error,
    });

    it('return open items page for correct URL', () => {
      const URL = '/items';
      const result = [
        openAnyPageAction({
          name: 'items',
        }),
      ];

      expect(parseURL(URL)).to.deep.eq(result);
    });

    it('return open itemsById page for correct URL', () => {
      const URL = '/items/100';
      const result = [
        openAnyPageAction({
          name: 'itemsById',
          params: {
            id: '100',
          },
        }),
      ];

      expect(parseURL(URL)).to.deep.eq(result);
    });

    it('return open 404 page for incorrect URL', () => {
      const URL = '/items/100/200';
      const result = [
        openAnyPageAction({
          name: 'error404',
        }),
      ];

      expect(parseURL(URL)).to.deep.eq(result);
    });
  });
});
