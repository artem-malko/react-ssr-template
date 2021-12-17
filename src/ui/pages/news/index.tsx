import { CommonPage } from 'core/store/types';
import { memo, useState } from 'react';
import { Search } from 'ui/components/search';
import { StaticComponent } from 'ui/components/staticComponent';
import { Lazy } from 'ui/kit/lazy';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';

export interface NewsPage extends CommonPage {
  name: 'news';
  params: {
    page: number;
  };
}

export default memo<{ page: NewsPage }>(({ page }) => {
  const [n, s] = useState(0);
  return (
    <>
      <Search />
      <div style={{ padding: '20px 0' }} />
      <Lazy
        loader={() => import(/* webpackChunkName: "newsList" */ 'ui/components/newsList')}
        render={(NewsList) => <NewsList initialPage={page.params.page} />}
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
      <Link href="/news?p=1&render=useOnComplete" doNotPreventDefault target="_blank">
        useOnComplete
      </Link>{' '}
      to wait for the API response, and then send the first byte
      <br /> By the way, NewList component will be loaded with React.lazy and 10000ms timeout.
      <br /> This has been done to show you, that you can use SearchBar, even other React components are
      still in a loading stage
    </>
  );
});
