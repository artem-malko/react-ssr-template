import { CommonPage } from 'core/store/types';
import React, { lazy, memo } from 'react';
import { Search } from 'ui/components/search';
import { StaticComponent } from 'ui/components/staticComponent';
import { Preloader } from 'ui/kit/preloader';

const NewsList = lazy(() => import(/* webpackChunkName: "newsList" */ 'ui/components/newsList'));

export interface NewsPage extends CommonPage {
  name: 'news';
  params: {
    page: number;
  };
}

export default memo<{ page: NewsPage }>(({ page }) => {
  return (
    <>
      <Search />
      <div style={{ padding: '20px 0' }} />
      <React.Suspense fallback={<Preloader purpose="NewsList" />}>
        <NewsList initialPage={page.params.page} />
      </React.Suspense>
      <br />
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
      <a href="/news?p=1&render=useOnComplete" target="_blank" rel="noreferrer">
        useOnComplete
      </a>{' '}
      to wait for the API response, and then send the first byte
      <br /> By the way, NewList component will be loaded with React.lazy and 10000ms timeout.
      <br /> This has been done to show you, that you can use SearchBar, even other React components are
      still in a loading stage
    </>
  );
});
