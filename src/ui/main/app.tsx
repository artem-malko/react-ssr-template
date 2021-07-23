import React, { lazy, memo } from 'react';
import { Preloader } from 'ui/kit/preloader';
import { StaticComponent } from 'ui/components/staticComponent';
import { Search } from 'ui/components/search';

const NewsList = lazy(() => import(/* webpackChunkName: "newsList" */ 'ui/components/newsList'));

/**
 * Use renderCallback as described here https://github.com/reactwg/react-18/discussions/5
 */
type Props = {
  renderCallback: () => void;
};
export const App = memo<Props>(({ renderCallback }) => {
  return (
    <div
      ref={renderCallback}
      style={{
        padding: 10,
        outline: '1px solid red',
      }}
    >
      App component. This text is rendered before hacker news API will return any response
      <br />
      <br />
      <Search />
      <br />
      <br />
      <React.Suspense fallback={<Preloader />}>
        <NewsList />
      </React.Suspense>
      <br />
      <StaticComponent />
      <br /> The component above is rendered before hacker news API will return any response.
      <br /> News API has a 4000 ms timeout on the server side before a real request.
      <br /> Full HTML will be ready after NewList will fetch, checkout Network tab in your dev tools
      <br /> You can switch to a prev behavior, when client should wait,
      <br /> when all server side requests will be finished to send the first byte to client.
      <br /> Open{' '}
      <a href="http://localhost:4000?render=useOnComplete" target="_blank" rel="noreferrer">
        http://localhost:4000?render=useOnComplete
      </a>{' '}
      to wait for the API response, and then send the first byte
      <br /> By the way, NewList component will be loaded with React.lazy and 10000ms timeout.
      <br /> This has been done to show you, that you can use SearchBar, even other React components are
      still in a loading stage
    </div>
  );
});