import { memo, useEffect } from 'react';

import { useNewsItem } from 'application/queries/news/fetch/useNewsItem';
import { useStyles } from 'framework/public/styles';
import { useAppLogger, usePlatformAPI } from 'framework/public/universal';

import { styles } from './index.css';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const css = useStyles(styles);
  const newsItem = useNewsItem({ newsItemId });
  const platformAPI = usePlatformAPI();
  const { sendInfoLog } = useAppLogger();

  useEffect(() => {
    sendInfoLog({
      id: 'test_newsitem_render',
      message: 'NEWSITEM RENDERED ON CLIENT',
    });

    platformAPI.cookies.set('cookie', new Date().toString());
  }, [platformAPI.cookies, sendInfoLog]);

  return (
    <div className={css('root')}>
      <h2>NewsITEM Component</h2>
      <div onClick={() => newsItem.refetch()}>Refetch</div>
      {newsItem.isFetching && <div>Updating...</div>}
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
