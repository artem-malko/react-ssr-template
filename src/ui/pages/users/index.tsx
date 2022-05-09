import { useUserById } from 'core/queries/users/useUserById';
import { UserStatus } from 'core/services/fake/types';
import { CommonPage } from 'core/store/types';
import { memo } from 'react';

export interface UsersPage extends CommonPage {
  name: 'users';
  params: {
    page: number;
    filterStatus?: UserStatus;
    activeUserId?: string;
  };
}

export default memo<{ page: UsersPage }>(({ page }) => {
  const userByIdResult = useUserById('qwe');

  return (
    <>
      <div>{JSON.stringify(page)}</div>
    </>
  );
});
