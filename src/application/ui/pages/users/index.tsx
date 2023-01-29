import { memo, Suspense } from 'react';

import { CommonPage } from 'application/main/types';
import { UserStatus } from 'application/services/fake/types';
import { AddUser } from 'application/ui/components/users/add';
import { FakeAPIConfigurator } from 'application/ui/components/users/configurator';
import { UserList } from 'application/ui/components/users/list';
import { GlassBoundary } from 'application/ui/kit/glass/context';
import { Lazy } from 'application/ui/kit/lazy';
import { Link } from 'application/ui/kit/link';
import { Preloader } from 'application/ui/kit/preloader';
import { Spoiler } from 'application/ui/kit/spoiler';

export interface UsersPage extends CommonPage {
  name: 'users';
  params: {
    page: number;
    filterStatus?: UserStatus[];
    activeUserId?: string;
  };
}

export const usersPageDefaultParams: UsersPage['params'] = {
  page: 1,
  filterStatus: undefined,
  activeUserId: undefined,
};

/**
 * This page is made to demonstrate several approaches, how to work with mutations in react-query
 * You can delete it any time you want
 */
export default memo<{ page: UsersPage }>(({ page }) => {
  return (
    <>
      <h1>React Query mutations and error handling example</h1>
      <div style={{ padding: 20, maxWidth: '50%' }}>
        <p>
          There is a list of users. These users are loaded via a fake API (checkout{' '}
          <Link
            href="https://github.com/artem-malko/react-ssr-template/blob/main/src/applications/server/services/fakeCrud/index.ts"
            target="_blank"
          >
            sources on github
          </Link>
          &nbsp;for more info).
        </p>
        <p>
          That fake API implements CRUD operations with users. Moreover, read operations allow you to
          filter the list or even load the next page. You can add a new user or edit somebody from the
          list. The list will be updated with a new data and all your edits/additions will be dropped on
          a new release. But do not worry, I do not have a lot of releases =)
        </p>
        <p>
          In the bottom of the page you can find a fake latency/error response configuration. These
          optins will be useful, if you want to test loading or error states. Just check a checkbox and
          try to update/filter the list. Be careful, these options use cookies! =)
        </p>
        <p>
          And the last interesting thing — optimistic update/always invalidate data for a user edit. Try
          it by yourself, to understand, where is a problem with the optimistic update.
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
          <Suspense fallback={<Preloader purpose="UserList data loading" />}>
            <UserList filterStatus={page.params.filterStatus} page={page.params.page} />
          </Suspense>
        </GlassBoundary>
        <br />
        <br />

        {page.params.activeUserId && <UserEditorWrapper activeUserId={page.params.activeUserId} />}

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
});

const UserEditorWrapper = memo<{ activeUserId: string }>(({ activeUserId }) => {
  return (
    <Suspense fallback={<Preloader purpose="UserEditor" />}>
      <Lazy
        loader={() =>
          import(/* webpackChunkName: "userListEditor" */ 'application/ui/components/users/editor')
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
  );
});
