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
  return (
    <div ref={renderCallback}>
      App component. This text is rendered before hacker news API will return any response
      <br />
      <React.Suspense fallback={<Preloader />}>
        <NewsList />
      </React.Suspense>
      <br />
      <StaticComponent />
      <br /> The componet above is rendered before hacker news API will return any response
      <br /> Full HTML will be ready after NewList will fetch, checkout Network tab in your dev tools
      <br /> There is a problem with refetching after the hydration process. So, WIP)
    </div>
  );
});
