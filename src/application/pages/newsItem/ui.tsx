import { memo } from 'react';

import NewsItem from 'application/features/newsItem';

import { NewsItemPage } from '.';
import { ReactQueryBoundary } from 'application/shared/lib/query';

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
        <ReactQueryBoundary>
          <NewsItem newsItemId={page.params.id} />
        </ReactQueryBoundary>
      </>
    );
  },
);
