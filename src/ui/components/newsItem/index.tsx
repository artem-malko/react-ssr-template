import { useNewsItem } from 'core/queries/useNewsItem';
import { memo, useEffect } from 'react';

export const NewsItem = memo<{ newsItemId: number }>(({ newsItemId }) => {
  const { newsItem } = useNewsItem(newsItemId);

  useEffect(() => {
    console.log('NEWSITEM RENDERED ON CLIENT');
  }, []);

  return (
    <div>
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
