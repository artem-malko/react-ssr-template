import { memo, useCallback } from 'react';

import { usersPageDefaultParams } from 'application/pages/shared';

import {
  type User,
  useDeleteUser,
  useInvalidateAllUserQueries,
  UserStatusComponent,
} from 'application/entities/domain/user';
import { useNavigate } from 'application/entities/ui/navigation';

import { useSomethingWentWrongToast } from 'application/shared/hooks/useSomethingWentWrongToast';
import { useToast } from 'application/shared/kit/toast';

type Props = {
  user: User;
  index: number;
  page: number;
};
export const UserTableRow = memo<Props>(({ user, index, page }) => {
  const { navigate } = useNavigate();
  const { showToast } = useToast();
  const showSomethingWentWrongToast = useSomethingWentWrongToast();
  const invalidateAllUserQuries = useInvalidateAllUserQueries();
  const toggleActiveUser = useCallback(
    (userId: string | undefined) => {
      return navigate((activePage) => ({
        name: 'users',
        params: {
          ...(activePage.name === 'users' ? activePage.params : usersPageDefaultParams),
          activeUserId: userId,
        },
      }));
    },
    [navigate],
  );
  const { mutate: deleteUser, isPending: isMutationInProgress } = useDeleteUser();
  const onDeleteClick = useCallback(() => {
    return deleteUser(
      { userId: user.id, name: user.name },
      {
        onSuccess(_, params) {
          toggleActiveUser(undefined);
          showToast({
            body: () => <>User with name {params.name} has been deleted!</>,
          });

          invalidateAllUserQuries()
            .then(() => {
              showToast({
                body: () => <>User list was invalidated!</>,
              });
            })
            .catch(() => {
              showSomethingWentWrongToast({
                description: 'User list was not invalidated!',
              });
            });
        },
        onError() {
          showSomethingWentWrongToast({
            description: 'Something happen while user deletion!',
          });
        },
      },
    );
  }, [
    deleteUser,
    toggleActiveUser,
    user.id,
    user.name,
    invalidateAllUserQuries,
    showToast,
    showSomethingWentWrongToast,
  ]);

  return (
    <tr>
      <td>{index + 1 + (page - 1) * 10}</td>
      <td>{user.id}</td>
      <td>
        <strong>{user.name}</strong>
      </td>
      <td style={{ textAlign: 'center' }}>
        <UserStatusComponent status={user.status} />
      </td>
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
