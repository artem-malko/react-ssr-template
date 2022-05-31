import { useInfinityNews } from 'core/queries/news/useInfinityNews';
import { memo } from 'react';
import { Lazy } from 'ui/kit/lazy';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';

const InfinityList = memo<{ initialPage: number; onItemHover: (title: string) => void }>(
  ({ initialPage, onItemHover }) => {
    const infinityNews = useInfinityNews({ initialPage });

    return (
      <>
        <h3>Infinity List</h3>
        <br />
        {infinityNews.isFetching && !infinityNews.isFetchingNextPage && <div>isFetching...</div>}
        {infinityNews.isError && <div>ERROR: {infinityNews.error.code}</div>}
        {infinityNews.isSuccess && (
          <div>
            {infinityNews.data.pages.map((p) =>
              p.slice(0, 10).map((item) => (
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
              )),
            )}
          </div>
        )}
        <div>
          <button
            onClick={() => infinityNews.fetchNextPage()}
            disabled={!infinityNews.hasNextPage || infinityNews.isFetchingNextPage}
          >
            {infinityNews.isFetchingNextPage
              ? 'Loading more...'
              : infinityNews.hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
          </button>
        </div>
      </>
    );
  },
);
InfinityList.displayName = 'InfinityList';

export default InfinityList;
