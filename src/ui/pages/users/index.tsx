import { UserStatus } from 'core/services/fake/types';
import { CommonPage } from 'core/store/types';
import { memo, Suspense } from 'react';
import { AddUser } from 'ui/components/users/add';
import { FakeAPIConfigurator } from 'ui/components/users/configurator';
import { UserList } from 'ui/components/users/list';
import { Lazy } from 'ui/kit/lazy';
import { Preloader } from 'ui/kit/preloader';
import { Spoiler } from 'ui/kit/spoiler';

export interface UsersPage extends CommonPage {
  name: 'users';
  params: {
    page: number;
    filterStatus?: UserStatus[];
    activeUserId?: string;
  };
}

/**
 * This page is made to demonstrate several approaches, how to work with mutations in react-query
 * You can delete it any time you want
 */
export default memo<{ page: UsersPage }>(({ page }) => {
  return (
    <>
      <Suspense fallback={<Preloader purpose="UserList data loading" />}>
        <UserList filterStatus={page.params.filterStatus} page={page.params.page} />
      </Suspense>
      <br />
      <br />
      {page.params.activeUserId && <UserEditorWrapper activeUserId={page.params.activeUserId} />}
      <br />
      <br />
      <hr />
      <AddUser />
      <br />
      <br />

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
    </>
  );
});

const UserEditorWrapper = memo<{ activeUserId: string }>(({ activeUserId }) => {
  return (
    <Suspense fallback={<Preloader purpose="UserEditor" />}>
      <Lazy
        loader={() => import(/* webpackChunkName: "userListEditor" */ 'ui/components/users/editor')}
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
