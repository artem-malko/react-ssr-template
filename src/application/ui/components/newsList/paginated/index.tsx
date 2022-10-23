import { memo, useCallback } from 'react';

import { useNavigate } from 'application/main/hooks/useNavigate';
import { usePaginatedNews } from 'application/queries/news/usePaginatedNews';
import { Lazy } from 'application/ui/kit/lazy';
import { Link } from 'application/ui/kit/link';
import { Preloader } from 'application/ui/kit/preloader';
import { useToast } from 'application/ui/kit/toast/infrastructure/hook';
import { newsPageDefaultParams } from 'application/ui/pages/news';

const PaginatedList = memo<{ pageNumber: number; onItemHover: (title: string) => void }>(
  ({ pageNumber, onItemHover }) => {
    const { showToast } = useToast();
    const { navigate } = useNavigate();
    const { queryResult: news } = usePaginatedNews({
      page: pageNumber,
    });

    const onPageChange = useCallback(
      (action: 'inc' | 'dec') => {
        const newPageNumber = action === 'inc' ? pageNumber + 1 : pageNumber - 1;

        navigate((activePage) => ({
          name: 'news',
          params: {
            ...(activePage.name === 'news' ? activePage.params : newsPageDefaultParams),
            page: newPageNumber,
          },
        })).then(() => {
          showToast({
            body: () => <>New page: ${newPageNumber}. This toast is shown from signal</>,
          });
        });
      },
      [pageNumber, navigate, showToast],
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
        {news.isLoading && <div>LOADING...</div>}
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
                  status === 'error' ? <>NewListItem error</> : <Preloader purpose="NewListItem" />
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
