import { memo, useEffect } from 'react';

import { useNewsItem } from 'application/queries/news/useNewsItem';
import { useStyles } from 'framework/infrastructure/css/hook';
import { useAppLogger } from 'framework/infrastructure/logger/react/hook';
import { usePlatformAPI } from 'framework/infrastructure/platform/shared/context';

import { styles } from './index.css';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const css = useStyles(styles);
  const { queryResult: newsItem, invalidateQuery } = useNewsItem({ newsItemId });
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
      <div onClick={() => invalidateQuery()}>INVALIDATE</div>
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
