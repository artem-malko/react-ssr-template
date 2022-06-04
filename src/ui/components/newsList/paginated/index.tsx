import { usePaginatedNews } from 'core/queries/news/usePaginatedNews';
import { memo, useCallback } from 'react';
import { Lazy } from 'ui/kit/lazy';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';
import { useAppRouter } from 'hooks/useAppRouter';
import { NewsPage } from 'ui/pages/news';
import { useToast } from 'ui/kit/toast/infrastructure/hook';

const PaginatedList = memo<{ pageNumber: number; onItemHover: (title: string) => void }>(
  ({ pageNumber, onItemHover }) => {
    const { showToast } = useToast();
    const { patchPage } = useAppRouter();
    const { queryResult: news } = usePaginatedNews({
      page: pageNumber,
    });

    const onPageChange = useCallback(
      (action: 'inc' | 'dec') => {
        const newPageNumber = action === 'inc' ? pageNumber + 1 : pageNumber - 1;

        patchPage<NewsPage>((activePage) => ({
          name: 'news',
          params: {
            ...activePage.params,
            page: newPageNumber,
          },
        })).then(() => {
          showToast({
            body: () => <>New page: ${newPageNumber}. This toast is shown from signal</>,
          });
        });
      },
      [pageNumber, patchPage, showToast],
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
