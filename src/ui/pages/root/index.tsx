import { memo } from 'react';
import { CommonPage } from 'core/store/types';

export interface RootPage extends CommonPage {
  name: 'root';
}

export default memo<{ page: RootPage }>(() => {
  return <>Root Page</>;
});
