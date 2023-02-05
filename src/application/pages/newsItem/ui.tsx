import { memo } from 'react';

import NewsItem from 'application/features/newsItem';

import { NewsItemPage } from '.';

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
