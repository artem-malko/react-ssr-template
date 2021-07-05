import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { memo, useState } from 'react';

export const NewsList = memo(() => {
  const [page, setPage] = useState(1);
  const news = usePaginatedNews(page);

  return (
    <div>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev page
      </button>
      <button onClick={() => setPage(page + 1)}>Next page</button>
      {news.isFetching && <div>Updating...</div>}
      {news.isSuccess &&
        news.data.map((item) => (
          <div key={item.id}>
            {item.title}
            <hr />
          </div>
        ))}
      <br />
    </div>
  );
});
