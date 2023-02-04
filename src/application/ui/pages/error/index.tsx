import { memo } from 'react';

import { RaiseError } from 'framework/public/universal';

import type { CommonPage } from 'application/main/types';

export interface ErrorPage extends CommonPage {
  name: 'error';
  params: {
    code: number;
  };
}

export default memo<{ page: ErrorPage }>(({ page }) => {
  return (
    <>
      <RaiseError code={page.params.code} />
      Error Page {page.params.code}
    </>
  );
});
