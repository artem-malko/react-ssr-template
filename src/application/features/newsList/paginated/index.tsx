import { memo, useCallback, useEffect } from 'react';

import { newsPageDefaultParams } from 'application/pages/shared';

import { usePaginatedNewsList } from 'application/entities/domain/news';
import { Link, useNavigate } from 'application/entities/ui/navigation';

import { Lazy } from 'application/shared/kit/lazy';
import { Preloader } from 'application/shared/kit/preloader';
import { useToast } from 'application/shared/kit/toast';

const PaginatedList = memo<{ pageNumber: number; onItemHover: (title: string) => void }>(
  ({ pageNumber, onItemHover }) => {
    const { showToast } = useToast();
    const { navigate } = useNavigate();
    const news = usePaginatedNewsList({
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

    useEffect(() => {
      import('application/shared/lib/showPageName').then((t) => {
        t.showPageName('Paginated newslist on news page with preload');
      });
    }, []);

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
        {news.isError && <div>ERROR: {JSON.stringify(news.error)}</div>}
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
