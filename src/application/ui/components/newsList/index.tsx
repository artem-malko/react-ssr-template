import { memo, useCallback, useEffect, useId, useState } from 'react';

import { useNavigate } from 'application/main/hooks/useNavigate';
import { Lazy } from 'application/ui/kit/lazy';
import { Preloader } from 'application/ui/kit/preloader';
import { useToast } from 'application/ui/kit/toast/infrastructure/hook';
import { newsPageDefaultParams } from 'application/ui/pages/news';
import { useStyles } from 'framework/public/styles';
import { useURLQuery } from 'framework/public/universal';

import { styles } from './index.css';

export const NewsList = memo<{ initialPage: number; useInfinityList: boolean }>(
  ({ initialPage, useInfinityList }) => {
    const css = useStyles(styles);
    const { navigate } = useNavigate();
    // Just to try a new hook)
    const id = useId();
    const { showToast } = useToast();
    const { URLQueryParams } = useURLQuery();
    const URLQueryParamsCount = Object.keys(URLQueryParams || {}).length;
    const [listType, setListType] = useState<'paginated' | 'infinity'>(
      useInfinityList ? 'infinity' : 'paginated',
    );
    const switchListType = useCallback(() => {
      const newType = listType === 'paginated' ? 'infinity' : 'paginated';
      setListType(newType);
      navigate((activePage) => ({
        name: 'news',
        params: {
          ...(activePage.name === 'news' ? activePage.params : newsPageDefaultParams),
          useInfinity: newType === 'infinity',
        },
      }));
    }, [listType, navigate]);

    /**
     * This handlers is used as a marker, that
     */
    const onItemHover = useCallback((title: string) => {
      console.log('hovered item with title: ', title);
    }, []);

    useEffect(() => {
      console.log('NEWSLIST RENDERED ON CLIENT! ID from useId(): ', id);
    }, [id]);

    return (
      <div className={css('root', ['_big', '_tablet'])} id={id}>
        <h2 className={css('title', URLQueryParamsCount > 0 ? ['_red'] : [])}>NewsList Component</h2>
        <br />
        <div>
          <button onClick={switchListType}>Switch list type</button>
          &nbsp;Current type is: <strong>{listType}</strong>
        </div>
        <br />
        <div className={css('list', URLQueryParamsCount > 0 ? ['_red'] : [])}>
          {URLQueryParamsCount > 0 && (
            <div
              style={{
                height: '400px',
                width: '100%',
                background: 'red',
              }}
            >
              JUST A BIG DIV
            </div>
          )}
          {listType === 'paginated' ? (
            <Lazy
              loader={() => import('./paginated')}
              render={(List) => <List pageNumber={initialPage} onItemHover={onItemHover} />}
              fallback={(status) =>
                status === 'error' ? (
                  <>paginatedNewList error</>
                ) : (
                  <Preloader purpose="paginatedNewList" />
                )
              }
              key="paginated"
            />
          ) : (
            <Lazy
              loader={() => import('./infinity')}
              render={(List) => <List initialPage={initialPage} onItemHover={onItemHover} />}
              fallback={(status) =>
                status === 'error' ? <>infinityNewList error</> : <Preloader purpose="infinityNewList" />
              }
              key="infinity"
            />
          )}

          {URLQueryParamsCount > 0 && (
            <div
              style={{
                height: '400px',
                width: '100%',
                background: 'red',
              }}
            >
              JUST A BIG DIV
            </div>
          )}
        </div>
        <br />
        <button
          onClick={() =>
            showToast({
              body: () => (
                <div>
                  This is a toast from hook! You can use any <strong>JSX Here</strong>
                </div>
              ),
            })
          }
        >
          Show example toast via hook
        </button>
      </div>
    );
  },
);
export default NewsList;
