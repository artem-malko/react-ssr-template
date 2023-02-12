import { memo, useCallback, useState } from 'react';

import { Search } from 'application/features/search';
import { StaticComponent } from 'application/features/staticComponent';
import { Lazy } from 'application/shared/kit/lazy';
import { Link } from 'application/shared/kit/link';
import { Preloader } from 'application/shared/kit/preloader';
import { useURLQuery } from 'framework/public/universal';

import { NewsPage, newsPageDefaultParams } from '.';

export default memo<{ page: NewsPage }>(
  ({
    page = {
      name: 'news',
      params: newsPageDefaultParams,
    },
  }) => {
    const [n, s] = useState(0);
    const { URLQueryParams, updateURLQuery } = useURLQuery();
    const addURLQuery = useCallback(() => {
      updateURLQuery({
        queryParams: Object.keys(URLQueryParams || {}).length
          ? {}
          : {
              test_mode_attr: ['2'],
            },
      });
    }, [updateURLQuery, URLQueryParams]);

    return (
      <>
        <Search />
        <div style={{ padding: '20px 0' }} />
        <button onClick={addURLQuery}>Patch URL Query to change NewsList header color</button>
        <br /> <br />
        <br />
        <Lazy
          loader={() => import(/* webpackChunkName: "newsList" */ 'application/features/newsList')}
          render={(NewsList) => (
            <NewsList initialPage={page.params.page} useInfinityList={!!page.params.useInfinity} />
          )}
          fallback={(status) =>
            status === 'loading' ? (
              <Preloader purpose="NewsList LOADING" />
            ) : (
              <Preloader purpose="NewsList ERROR" />
            )
          }
        />
        <br />
        {n}
        <button onClick={() => s(n + 1)}>INCT</button>
        <div style={{ padding: '20px 0' }} />
        <StaticComponent />
        <div style={{ padding: '20px 0' }} />
        This text is rendered before hacker news API will return any response
        <br /> The component above is rendered before hacker news API will return any response.
        <br /> News API has a 4000 ms timeout on the server side before a real request.
        <br /> Full HTML will be ready after NewList will fetch, checkout Network tab in your dev tools
        <br /> You can switch to a prev behavior, when client should wait,
        <br /> when all server side requests will be finished to send the first byte to client.
        <br /> Open{' '}
        <Link href="/news?p=1&render=onAllReady" target="_blank">
          onAllReady
        </Link>{' '}
        to wait for the API response, and then send the first byte
        <br /> By the way, NewList component will be loaded with React.lazy and 10000ms timeout.
        <br /> This has been done to show you, that you can use SearchBar, even other React components
        are still in a loading stage
      </>
    );
  },
);