import { memo, useEffect } from 'react';

import { useStyles } from 'framework/public/styles';
import { useAppLogger, usePlatformAPI } from 'framework/public/universal';

import { useNewsItemById } from 'application/entities/domain/news';

import { styles } from './index.css';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const css = useStyles(styles);
  const newsItem = useNewsItemById({ newsItemId });
  const platformAPI = usePlatformAPI();
  const { sendInfoLog } = useAppLogger();

  useEffect(() => {
    if (newsItem.isSuccess) {
      sendInfoLog({
        id: 'test_newsitem_render',
        message: 'NEWSITEM RENDERED ON CLIENT',
      });

      platformAPI.cookies.set('lastOpenedNewsItemId', newsItem.data.id.toString());
    }
  }, [platformAPI.cookies, newsItem.isSuccess, newsItem.data?.id, sendInfoLog]);

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
export default NewsItem;
