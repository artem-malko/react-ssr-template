import { memo } from 'react';

import { CommonPage } from 'application/main/types';
import NewsItem from 'application/ui/components/newsItem';

export interface NewsItemPage extends CommonPage {
  name: 'newsItem';
  params: {
    id: number;
  };
}

export default memo<{ page: NewsItemPage }>(({ page }) => {
  return (
    <>
      <div>news item with id {page.params.id}</div>
      <NewsItem newsItemId={page.params.id} />
    </>
  );
});
