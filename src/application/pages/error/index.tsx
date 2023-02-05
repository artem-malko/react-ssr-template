import { memo } from 'react';

import { RaiseError } from 'framework/public/universal';

import type { CommonPage } from 'application/pages/shared';

export interface ErrorPage extends CommonPage {
  name: 'error';
  params: {
    code: number;
  };
}

export default memo<{ page: ErrorPage }>(
  ({
    page = {
      name: 'error',
      params: {
        code: 500,
      },
    },
  }) => {
    return (
      <>
        <RaiseError code={page.params.code} />
        Error Page {page.params.code}
      </>
    );
  },
);
