import { memo, Suspense, useEffect } from 'react';

import { AddUser } from 'application/features/addUser';
import { FakeAPIConfigurator } from 'application/features/fakeAPIConfigurator';
import { UserList } from 'application/features/userList';

import { Link } from 'application/entities/ui/navigation';

import { GlassBoundary, useGlassContext } from 'application/shared/kit/glass';
import { Lazy } from 'application/shared/kit/lazy';
import { Preloader } from 'application/shared/kit/preloader';
import { Spoiler } from 'application/shared/kit/spoiler';

import { UsersPage, usersPageDefaultParams } from '.';
import { isParsedError, RaiseError } from 'framework/public/universal';

import { ReactQueryBoundary } from 'application/shared/lib/query';

/**
 * This page is made to demonstrate several approaches, how to work with mutations in react-query
 * You can delete it any time you want
 */
export default memo<{ page: UsersPage }>(
  ({
    page = {
      name: 'users',
      params: usersPageDefaultParams,
    },
  }) => {
    const activeUserId = page.params.activeUserId;

    return (
      <>
        <h1>React Query mutations and error handling example</h1>
        <div style={{ padding: 20, maxWidth: '50%' }}>
          <p>
            There is a list of users. These users are loaded via a fake API (checkout{' '}
            <Link
              href="https://github.com/artem-malko/react-ssr-template/blob/main/src/application/entry/server/routes/fakeCrud.ts"
              target="_blank"
            >
              sources on github
            </Link>
            &nbsp;for more info).
          </p>
          <p>
            That fake API implements CRUD operations with users. Moreover, read operations allow you to
            filter the list or even load the next page. You can add a new user or edit somebody from the
            list. The list will be updated with a new data and all your edits/additions will be dropped
            on a new release. But do not worry, I do not have a lot of releases =)
          </p>
          <p>
            In the bottom of the page you can find a fake latency/error response configuration. These
            optins will be useful, if you want to test loading or error states. Just check a checkbox and
            try to update/filter the list. Be careful, these options use cookies! =)
          </p>
          <p>
            And the last interesting thing — optimistic update/always invalidate data for a user edit.
            Try it by yourself, to understand, where is a problem with the optimistic update.
          </p>
          <p>I have one case:</p>
          <ul>
            <li>Filter the list by any status</li>
            <li>Click the Edit button in any user from that list</li>
            <li>Update a status of that user</li>
          </ul>
          <p>
            If you use the always invalidate strategy — there are no any problems. But, in case of using
            the optimistic update strategy — you will see a bug. You can switch the strategy in the user
            editor.
          </p>
        </div>
        <br />
        <br />
        <GlassBoundary name="fulllist">
          <GlassBoundary name="list">
            <ReactQueryBoundary
              loadingFallback={<Preloader purpose="UserList data loading" />}
              errorFallback={({ error, resetErrorBoundary }) => {
                const { hideGlass } = useGlassContext();

                useEffect(() => {
                  hideGlass('list');
                }, []);

                return (
                  <>
                    <h1>ERROR!</h1>
                    {isParsedError(error) && <RaiseError code={error.code} />}
                    <strong>{JSON.stringify(error)}</strong>
                    <button onClick={resetErrorBoundary}>Retry</button>
                  </>
                );
              }}
            >
              <UserList filterStatus={page.params.filterStatus} page={page.params.page} />
            </ReactQueryBoundary>
          </GlassBoundary>
          <br />
          <br />

          {activeUserId && (
            <Suspense fallback={<Preloader purpose="UserEditor" />}>
              <Lazy
                loader={() =>
                  import(
                    /* webpackChunkName: "userListEditor__sk__pr__" */ 'application/features/editUser'
                  ).then((module) => ({ default: module.UserEditor }))
                }
                render={(UserEditor) => <UserEditor userId={activeUserId} />}
                fallback={(status) =>
                  status === 'loading' ? (
                    <Preloader purpose="UserEditor LOADING" />
                  ) : (
                    <Preloader purpose="UserEditor ERROR" />
                  )
                }
              />
            </Suspense>
          )}

          <br />
          <br />
          <hr />
          <AddUser />
          <br />
          <br />
        </GlassBoundary>

        <Spoiler>
          {(isExpanded, toggle) => (
            <>
              <div onClick={toggle} style={{ paddingBottom: 8, cursor: 'pointer' }}>
                {isExpanded ? <button>Hide configurator</button> : <button>Show configurator</button>}
              </div>
              {isExpanded && <FakeAPIConfigurator />}
            </>
          )}
        </Spoiler>

        {/* A gap for reactQuery dev tools */}
        <div style={{ height: 300 }} />
      </>
    );
  },
);
