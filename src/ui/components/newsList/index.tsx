import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { patchPage } from 'core/signals/page';
import { useAppSelector } from 'core/store/hooks';
import { useStyles } from 'infrastructure/css/hook';
import { sequence } from 'infrastructure/signal';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Lazy } from 'ui/kit/lazy';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';
import { showToast as showToastAction } from 'ui/kit/toast/infrastructure/action';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { styles } from './index.css';
const { useId } = require('react');

export const NewsList = memo<{ initialPage: number }>(({ initialPage }) => {
  const css = useStyles(styles);
  // Just to try a new hook)
  const id = useId();
  const [pageNumber, setPageNumber] = useState(initialPage);
  const news = usePaginatedNews(pageNumber);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const URLQueryParams = useAppSelector((s) => s.appContext.URLQueryParams);
  const URLQueryParamsCount = Object.keys(URLQueryParams || {}).length;
  const onPageChange = useCallback(
    (action: 'inc' | 'dec') => {
      const newPageNumber = action === 'inc' ? pageNumber + 1 : pageNumber - 1;
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
            title: 'New page: ' + newPageNumber + '. This toast is shown from signal',
            type: 'success',
          }),
        ),
      );
      setPageNumber(newPageNumber);
    },
    [pageNumber, dispatch],
  );

  /**
   * This handlers is used as a marker, that
   */
  const onItemHover = useCallback(() => {
    console.log('hovered');
  }, []);

  useEffect(() => {
    console.log('NEWSLIST RENDERED ON CLIENT! ID from useId(): ', id);
  }, [id]);

  return (
    <div className={css('root', ['_big', '_tablet'])} id={id}>
      <h2 className={css('title', URLQueryParamsCount > 0 ? ['_red'] : [])}>NewsList Component</h2>
      <button disabled={pageNumber === 1} onClick={() => onPageChange('dec')}>
        Prev page
      </button>
      <button onClick={() => onPageChange('inc')}>Next page</button>
      <br />
      <br />

      <div className={css('list', URLQueryParamsCount > 0 ? ['_red'] : [])}>
        {news.isFetching && <div>Updating...</div>}
        {news.isSuccess &&
          news.data.slice(0, 10).map((item) => (
            <Link
              page={{
                name: 'newsItem',
                params: {
                  id: item.id,
                },
              }}
              key={item.id}
            >
              {/*
                This import is used as an example of a problem with nested dynamic imports
                Get more info right here src/infrastructure/dependencyManager/manager.ts
              */}
              <Lazy
                loader={() => import('./item')}
                render={(Item) => <Item title={item.title} onHover={onItemHover} />}
                fallback={(status) =>
                  status === 'error' ? <>errror</> : <Preloader purpose="NewListItem" />
                }
              />
              <hr />
            </Link>
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
