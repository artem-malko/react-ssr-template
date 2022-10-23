import { usePlatformAPI } from 'framework/platform/shared/context';
import { useNewsItem } from 'application/queries/news/useNewsItem';
import { useStyles } from 'framework/infrastructure/css/hook';
import { memo, useEffect } from 'react';
import { styles } from './index.css';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const css = useStyles(styles);
  const { queryResult: newsItem, invalidateQuery } = useNewsItem({ newsItemId });
  const platformAPI = usePlatformAPI();

  useEffect(() => {
    console.log('NEWSITEM RENDERED ON CLIENT');
    platformAPI.cookies.set('cookie', new Date().toString());
  }, [platformAPI.cookies]);

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
