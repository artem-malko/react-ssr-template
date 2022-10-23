import { memo } from 'react';

import { CommonPage } from 'application/main/types';
import { HttpErrorCode } from 'framework/types/http';

export interface ErrorPage extends CommonPage {
  name: 'error';
  params: {
    code: HttpErrorCode;
  };
}

export default memo<{ page: ErrorPage }>(() => {
  return <>Error Page</>;
});
