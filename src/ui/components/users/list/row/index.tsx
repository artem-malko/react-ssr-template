import { User, UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useAppRouter } from 'hooks/useAppRouter';
import { memo, useCallback } from 'react';
import { useMutation } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { UsersPage } from 'ui/pages/users';

type Props = {
  user: User;
  index: number;
  page: number;
};
export const UserTableRow = memo<Props>(({ user, index, page }) => {
  const { patchPage } = useAppRouter();
  const { showToast } = useToast();
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
  const services = useServices();
  const { mutate: deleteUser } = useMutation(() => {
    return services.fakeAPI.deleteUserById({ id: user.id });
  });
  const onDeleteClick = useCallback(() => {
    return deleteUser(undefined, {
      onSuccess() {
        toggleActiveUser(undefined);
        showToast({
          body: () => <>User with name {user.name} has been deleted</>,
        });
      },
      onError(error) {
        showToast({
          body: () => (
            <>
              Something happen while new user creation
              <br />
              {JSON.stringify(error)}
            </>
          ),
        });
      },
    });
  }, [deleteUser, toggleActiveUser, user.name, showToast]);

  return (
    <tr>
      <td>{index + 1 + (page - 1) * 10}</td>
      <td>{user.id}</td>
      <td>
        <strong>{user.name}</strong>
      </td>
      <td style={{ textAlign: 'center' }}>{renderStatus(user.status)}</td>
      <td>
        <button onClick={() => toggleActiveUser(user.id)}>✏️ Edit</button>
      </td>
      <td>
        <button onClick={onDeleteClick}>❌ delete</button>
      </td>
    </tr>
  );
});
UserTableRow.displayName = 'UserTableRow';

function renderStatus(status: UserStatus) {
  switch (status) {
    case 'active':
      return '🟢';
    case 'inactive':
      return '🟠';
    case 'banned':
      return '🔴';
  }
}
