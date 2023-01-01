import { memo } from 'react';

import { CommonPage } from 'application/main/types';
import { RaiseError } from 'framework/infrastructure/raise/react/component';

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
