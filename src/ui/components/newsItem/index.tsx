import { usePlatformAPI } from 'core/platform/shared/context';
import { useNewsItem } from 'core/queries/useNewsItem';
import { useStyles } from 'infrastructure/css/hook';
import { memo, useEffect } from 'react';
import { styles } from './index.css';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const css = useStyles(styles);
  const newsItem = useNewsItem(newsItemId);
  const platformAPI = usePlatformAPI();

  useEffect(() => {
    console.log('NEWSITEM RENDERED ON CLIENT');
    platformAPI.cookies.set('cookie', new Date().toString());
  }, [platformAPI.cookies]);

  return (
    <div className={css('root')}>
      <h2>NewsITEM Component</h2>
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
