import { UserStatus } from 'core/services/fake/types';
import { CommonPage } from 'core/store/types';
import { memo, Suspense } from 'react';
import { AddUser } from 'ui/components/users/add';
import { UserList } from 'ui/components/users/list';
import { Lazy } from 'ui/kit/lazy';
import { Preloader } from 'ui/kit/preloader';

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
 */
export default memo<{ page: UsersPage }>(({ page }) => {
  return (
    <>
      <Suspense fallback={<Preloader purpose="UserList" />}>
        <UserList filterStatus={page.params.filterStatus} page={page.params.page} />
      </Suspense>
      <br />
      <br />

      {page.params.activeUserId && <UserEditorWrapper activeUserId={page.params.activeUserId} />}

      <br />
      <br />
      <hr />
      <AddUser />
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
