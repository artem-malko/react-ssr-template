import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { memo, useState } from 'react';
import { InitialData } from 'ui/components/initialData';

export const NewsList = memo(() => {
  const [page, setPage] = useState(1);
  const { news, queryId } = usePaginatedNews(page);

  return (
    <div>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev page
      </button>
      <button onClick={() => setPage(page + 1)}>Next page</button>
      <br />
      <br />
      <div style={{ padding: 10, outline: '1px solid blue' }}>
        {news.isFetching && <div>Updating...</div>}
        {news.isSuccess &&
          news.data.map((item) => (
            <div key={item.id}>
              {item.title}
              <hr />
            </div>
          ))}
      </div>
      <InitialData queryId={queryId} queryOutput={news} />
    </div>
  );
});
