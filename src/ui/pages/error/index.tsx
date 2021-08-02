import { memo } from 'react';
import { HttpCode } from 'core/shared/httpCode';
import { CommonPage } from 'core/store/types';

export interface ErrorPage extends CommonPage {
  name: 'error';
  params: {
    code: HttpCode;
  };
}

export default memo<{ page: ErrorPage }>(() => {
  return <>Error Page</>;
});
