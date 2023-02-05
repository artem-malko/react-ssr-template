import { memo } from 'react';

import NewsItem from 'application/features/newsItem';
import { CommonPage } from 'application/pages/shared';

export interface NewsItemPage extends CommonPage {
  name: 'newsItem';
  params: {
    id: number;
  };
}

export default memo<{ page: NewsItemPage }>(
  ({
    page = {
      name: 'newsItem',
      params: {
        id: -1,
      },
    },
  }) => {
    return (
      <>
        <div>news item with id {page.params.id}</div>
        <NewsItem newsItemId={page.params.id} />
      </>
    );
  },
);
