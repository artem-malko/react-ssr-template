import { openPageAction } from 'core/actions/appContext/openPage';
import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { patchPage } from 'core/signals/page';
import { historyPush } from 'infrastructure/router/actions';
import { sequence } from 'infrastructure/signal';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { InitialData } from 'ui/components/initialData';

export const NewsList = memo<{ initialPage: number }>(({ initialPage }) => {
  const [page, setPage] = useState(initialPage);
  const { news, queryId } = usePaginatedNews(page);
  const dispatch = useDispatch();
  const onPageChange = useCallback(
    (action: 'inc' | 'dec') => {
      const newPageNumber = action === 'inc' ? page + 1 : page - 1;
      dispatch(
        patchPage((activePage) => {
          if (activePage.name !== 'news') {
            return;
          }

          return {
            name: 'news',
            params: {
              page: newPageNumber,
            },
          };
        }),
      );
      setPage(newPageNumber);
    },
    [page, dispatch],
  );

  const onNewsItemClick = useCallback(
    (id: number) => {
      dispatch(
        sequence(
          openPageAction({
            name: 'newsItem',
            params: {
              id,
            },
          }),
          historyPush(),
        ),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    console.log('NEWSLIST RENDERED ON CLIENT');
  }, []);

  return (
    <div>
      <h2>NewsList Component</h2>
      <button disabled={page === 1} onClick={() => onPageChange('dec')}>
        Prev page
      </button>
      <button onClick={() => onPageChange('inc')}>Next page</button>
      <br />
      <br />
      <div style={{ padding: 10, outline: '1px solid blue' }}>
        {news.isFetching && <div>Updating...</div>}
        {news.isSuccess &&
          news.data.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onNewsItemClick(item.id);
              }}
            >
              {item.title}
              <hr />
            </div>
          ))}
      </div>

      {/* Checkout InitialData sources to know, how it works */}
      <InitialData queryOutput={news} queryId={queryId} />
    </div>
  );
});
export default NewsList;
