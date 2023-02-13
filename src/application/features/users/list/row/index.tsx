import { memo, useCallback } from 'react';

import { useInvalidateAllLists } from 'application/entities/user/model/invalidate/useInvalidateAllLists';
import { useDeleteUser } from 'application/entities/user/model/mutate/useDeleteUser';
import { User } from 'application/entities/user/types';
import { usersPageDefaultParams } from 'application/pages/shared';
import { useNavigate } from 'application/shared/hooks/useNavigate';
import { useToast } from 'application/shared/kit/toast/infrastructure/hook';

import { renderStatus } from '../../utils';

type Props = {
  user: User;
  index: number;
  page: number;
};
export const UserTableRow = memo<Props>(({ user, index, page }) => {
  const { navigate } = useNavigate();
  const { showToast } = useToast();
  const invalidateAllLists = useInvalidateAllLists();
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
  const { mutate: deleteUser, isLoading: isMutationInProgress } = useDeleteUser();
  const onDeleteClick = useCallback(() => {
    return deleteUser(
      { userId: user.id, name: user.name },
      {
        onSuccess(_, params) {
          toggleActiveUser(undefined);
          showToast({
            body: () => <>User with name {params.name} has been deleted!</>,
          });

          invalidateAllLists()
            .then(() => {
              showToast({
                body: () => <>User list was invalidated!</>,
              });
            })
            .catch(() => {
              showToast({
                body: () => <>User list was not invalidated!</>,
              });
            });
        },
        onError(error) {
          showToast({
            body: () => (
              <>
                Something happen while user deletion
                <br />
                {JSON.stringify(error)}
              </>
            ),
          });
        },
      },
    );
  }, [deleteUser, toggleActiveUser, user.id, user.name, invalidateAllLists, showToast]);

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
