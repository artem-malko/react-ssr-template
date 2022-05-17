import { UserStatus } from 'core/services/fake/types';
import { CommonPage } from 'core/store/types';
import { memo, Suspense } from 'react';
import { AddUser } from 'ui/components/users/add';
import { UserEditor } from 'ui/components/users/editor';
import { UserList } from 'ui/components/users/list';
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

      {page.params.activeUserId && (
        <Suspense fallback={<Preloader purpose="UserEditor" />}>
          <UserEditor userId={page.params.activeUserId} />
        </Suspense>
      )}
      <br />
      <br />
      <hr />
      <AddUser />
    </>
  );
});
