import { memo } from 'react';

import { useNewsItemById } from 'application/entities/news/model/fetch/useNewsItemById';
import { useStyles } from 'framework/public/styles';

import { styles } from './index.css';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const css = useStyles(styles);
  const newsItem = useNewsItemById({ newsItemId });

  return (
    <div className={css('root')}>
      <h2>NewsITEM Component</h2>

      <button disabled={newsItem.isFetching} onClick={() => newsItem.refetch()}>
        {newsItem.isFetching ? <div>Refetching...</div> : <div>Refetch</div>}
      </button>

      {newsItem.isSuccess && (
        <>
          <div>id: {newsItem.data.id}</div>
          <div>title: {newsItem.data.title}</div>
        </>
      )}
    </div>
  );
});
