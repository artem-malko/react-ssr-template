import { CommonPage } from 'core/store/types';
import { memo } from 'react';

export interface NewsItemPage extends CommonPage {
  name: 'newsItem';
  params: {
    id: string;
  };
}

export default memo<{ page: NewsItemPage }>(({ page }) => {
  return <div>news item with id {page.params.id}</div>;
});
