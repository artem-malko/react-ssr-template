import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { memo, useLayoutEffect, useState } from 'react';
import { InitialData } from 'ui/components/initialData';

export const NewsList = memo(() => {
  const [page, setPage] = useState(1);
  const { news, queryId } = usePaginatedNews(page);

  useLayoutEffect(() => {
    console.log('NEWSLIST RENDERED ON CLIENT');
  }, []);

  return (
    <div>
      <h2>NewsList Component</h2>
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

      {/* Checkout a component sources to know, how it works */}
      <InitialData queryOutput={news} queryId={queryId} />
    </div>
  );
});
export default NewsList;
