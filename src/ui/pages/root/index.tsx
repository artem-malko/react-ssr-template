import { memo } from 'react';
import { CommonPage } from 'core/store/types';
import { Link } from 'ui/kit/link';

export interface RootPage extends CommonPage {
  name: 'root';
}

export default memo<{ page: RootPage }>(() => {
  return (
    <>
      <h1>
        Simple template for a website with SSR and{' '}
        <Link href="https://github.com/reactwg/react-18/discussions" target="_blank">
          React 18 with a brand new API
        </Link>
      </h1>
      <p>
        Start your journey with clicking to «<strong>Show page list</strong>» on the top of the page
      </p>
    </>
  );
});
