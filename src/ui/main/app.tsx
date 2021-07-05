import React, { memo } from 'react';
import { Preloader } from 'ui/kit/preloader';
import { NewsList } from 'ui/components/newsList';
import { StaticComponent } from 'ui/components/staticComponent';

/**
 * Use renderCallback as described here https://github.com/reactwg/react-18/discussions/5
 */
type Props = {
  renderCallback: () => void;
};
export const App = memo<Props>(({ renderCallback }) => {
  // Just for test
  const onSwitchRenderClick = () => {
    if (window.location.search) {
      window.location.href = 'http://localhost:4000';
      return;
    }

    window.location.href = 'http://localhost:4000?render=wait';
  };

  return (
    <div ref={renderCallback}>
      App component. This text is rendered before hacker news API will return any response
      <br />
      <br />
      <button onClick={onSwitchRenderClick}>
        Switch render (Open new URL in new a tab to see the difference)
      </button>
      <br />
      <br />
      <React.Suspense fallback={<Preloader />}>
        <NewsList />
      </React.Suspense>
      <br />
      <StaticComponent />
      <br /> The component above is rendered before hacker news API will return any response
      <br /> Full HTML will be ready after NewList will fetch, checkout Network tab in your dev tools
      <br /> There is a problem with refetching after the hydration process. So, WIP)
      <br /> You can switch to a prev behavior, when client should wait,
      <br /> when all server side requests will be finished to send the first byte to client
    </div>
  );
});
