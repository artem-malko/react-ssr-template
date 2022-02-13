import { useAppSelector } from 'core/store/hooks';
import { useStyles } from 'infrastructure/css/hook';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchPage } from 'core/signals/page';
import { Lazy } from 'ui/kit/lazy';
import { Preloader } from 'ui/kit/preloader';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { styles } from './index.css';

const { useId } = require('react');

export const NewsList = memo<{ initialPage: number; useInfinityList: boolean }>(
  ({ initialPage, useInfinityList }) => {
    const css = useStyles(styles);
    // Just to try a new hook)
    const id = useId();
    const { showToast } = useToast();
    const URLQueryParams = useAppSelector((s) => s.appContext.URLQueryParams);
    const URLQueryParamsCount = Object.keys(URLQueryParams || {}).length;
    const dispatch = useDispatch();
    const [listType, setListType] = useState<'paginated' | 'infinity'>(
      useInfinityList ? 'infinity' : 'paginated',
    );
    const switchListType = useCallback(() => {
      const newType = listType === 'paginated' ? 'infinity' : 'paginated';
      setListType(newType);
      dispatch(
        patchPage((activePage) => {
          if (activePage.name !== 'news') {
            return;
          }

          return {
            name: 'news',
            params: {
              ...activePage.params,
              useInfinity: newType === 'infinity',
            },
          };
        }),
      );
    }, [listType, dispatch]);

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
              render={(List) => <List initialPage={initialPage} onItemHover={onItemHover} />}
              fallback={(status) =>
                status === 'error' ? <>errror</> : <Preloader purpose="NewListItem" />
              }
              key="paginated"
            />
          ) : (
            <Lazy
              loader={() => import('./infinity')}
              render={(List) => <List initialPage={initialPage} onItemHover={onItemHover} />}
              fallback={(status) =>
                status === 'error' ? <>errror</> : <Preloader purpose="NewListItem" />
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
  },
);
export default NewsList;
