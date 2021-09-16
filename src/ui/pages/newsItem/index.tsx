import { CommonPage } from 'core/store/types';
import { memo } from 'react';
import NewsItem from 'ui/components/newsItem';

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
