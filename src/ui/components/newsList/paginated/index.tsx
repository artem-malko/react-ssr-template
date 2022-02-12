import { usePaginatedNews } from 'core/queries/usePaginatedNews';
import { patchPage } from 'core/signals/page';
import { sequence } from 'infrastructure/signal';
import { memo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showToast as showToastAction } from 'ui/kit/toast/infrastructure/action';
import { Lazy } from 'ui/kit/lazy';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';

const PaginatedList = memo<{ initialPage: number; onItemHover: (title: string) => void }>(
  ({ initialPage, onItemHover }) => {
    const [pageNumber, setPageNumber] = useState(initialPage);
    const news = usePaginatedNews(pageNumber);
    const dispatch = useDispatch();
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

    return (
      <>
        <h3>Paginated List</h3>
        <br />
        <button disabled={pageNumber === 1} onClick={() => onPageChange('dec')}>
          Prev page
        </button>
        <button onClick={() => onPageChange('inc')}>Next page</button>
        <br />
        <br />
        {news.isFetching && <div>Updating...</div>}
        {news.isError && <div>ERROR: {news.error.code}</div>}
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
                loader={() => import('../item')}
                render={(Item) => <Item title={item.title} onHover={onItemHover} />}
                fallback={(status) =>
                  status === 'error' ? <>errror</> : <Preloader purpose="NewListItem" />
                }
              />
              <hr />
            </Link>
          ))}
      </>
    );
  },
);
PaginatedList.displayName = 'PaginatedList';

export default PaginatedList;
