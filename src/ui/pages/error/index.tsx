import { memo } from 'react';
import { CommonPage } from 'core/store/types';
import { HttpErrorCode } from 'core/types/http';

export interface ErrorPage extends CommonPage {
  name: 'error';
  params: {
    code: HttpErrorCode;
  };
}

export default memo<{ page: ErrorPage }>(() => {
  return <>Error Page</>;
});
