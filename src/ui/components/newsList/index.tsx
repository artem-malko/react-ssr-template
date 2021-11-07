import { openPageAction } from 'core/actions/appContext/openPage';
import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { patchPage } from 'core/signals/page';
import { useStyles } from 'infrastructure/css/hook';
import { historyPush } from 'infrastructure/router/actions';
import { sequence } from 'infrastructure/signal';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showToast as showToastAction } from 'ui/kit/toast/infrastructure/action';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { styles } from './index.css';
const { useId } = require('react');

export const NewsList = memo<{ initialPage: number }>(({ initialPage }) => {
  const css = useStyles(styles);
  // Just to try a new hook)
  const id = useId();
  const [page, setPage] = useState(initialPage);
  const news = usePaginatedNews(page);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const onPageChange = useCallback(
    (action: 'inc' | 'dec') => {
      const newPageNumber = action === 'inc' ? page + 1 : page - 1;
      dispatch(
        sequence(
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
          showToastAction({
            id: newPageNumber.toString() + Math.random(),
            title: 'New page: ' + newPageNumber + 'This toast is shown from signal',
            type: 'success',
          }),
        ),
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
    console.log('NEWSLIST RENDERED ON CLIENT! ID from useId(): ', id);
  }, [id]);

  return (
    <div className={css('root', ['_big', '_tablet'])} id={id}>
      <h2>NewsList Component</h2>
      <button disabled={page === 1} onClick={() => onPageChange('dec')}>
        Prev page
      </button>
      <button onClick={() => onPageChange('inc')}>Next page</button>
      <br />
      <br />
      <div className={css('list')}>
        {news.isFetching && <div>Updating...</div>}
        {news.isSuccess &&
          news.data.slice(0, 10).map((item) => (
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
        {news.isError && <div>ERROR: {news.error.code}</div>}
      </div>
      <br />
      <button
        onClick={() =>
          showToast({
            id: Math.random().toString(),
            title: (
              <div>
                This is a toast from hook! You can use any <strong>JSX Here</strong>
              </div>
            ),
            type: 'default',
          })
        }
      >
        Show example toast via hook
      </button>
    </div>
  );
});
export default NewsList;
