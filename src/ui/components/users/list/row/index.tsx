import { useDeleteUser } from 'core/queries/users/useDeleteUser';
import { User } from 'core/services/fake/types';
import { useAppRouter } from 'hooks/useAppRouter';
import { memo, useCallback } from 'react';
import { UsersPage } from 'ui/pages/users';
import { renderStatus } from '../../utils';

type Props = {
  user: User;
  index: number;
  page: number;
};
export const UserTableRow = memo<Props>(({ user, index, page }) => {
  const { patchPage } = useAppRouter();
  const toggleActiveUser = useCallback(
    (userId: string | undefined) => {
      return patchPage<UsersPage>((activePage) => ({
        name: 'users',
        params: {
          ...activePage.params,
          activeUserId: userId,
        },
      }));
    },
    [patchPage],
  );
  const { mutate: deleteUser, isLoading: isMutationInProgress } = useDeleteUser();
  const onDeleteClick = useCallback(() => {
    return deleteUser(
      { userId: user.id, name: user.name },
      {
        onSuccess() {
          toggleActiveUser(undefined);
        },
      },
    );
  }, [deleteUser, toggleActiveUser, user.id, user.name]);

  return (
    <tr>
      <td>{index + 1 + (page - 1) * 10}</td>
      <td>{user.id}</td>
      <td>
        <strong>{user.name}</strong>
      </td>
      <td style={{ textAlign: 'center' }}>{renderStatus(user.status)}</td>
      <td>
        <button onClick={() => toggleActiveUser(user.id)} disabled={isMutationInProgress}>
          ✏️ Edit
        </button>
      </td>
      <td>
        <button onClick={onDeleteClick} disabled={isMutationInProgress}>
          ❌ delete
        </button>
      </td>
    </tr>
  );
});
UserTableRow.displayName = 'UserTableRow';
