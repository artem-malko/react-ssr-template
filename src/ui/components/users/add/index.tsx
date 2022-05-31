import { useUserListInvalidate } from 'core/queries/users/useUserList';
import { UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { memo } from 'react';
import { useMutation } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { UserForm } from '../form';

export const AddUser = memo(() => {
  const { showToast } = useToast();
  const services = useServices();
  const invalidateUserList = useUserListInvalidate();
  const { mutate: addUser } = useMutation((userToAdd: { name: string; status: UserStatus }) => {
    return services.fakeAPI.addUser({
      user: userToAdd,
    });
  });

  return (
    <div>
      <h1>Add user</h1>
      <br />
      <UserForm
        resetOnSubmit
        onSubmit={(name, status) => {
          addUser(
            { name, status },
            {
              onSuccess() {
                showToast({
                  body: () => <>User with name {name} has been added</>,
                });
                invalidateUserList({ page: 1 }).catch((error) => {
                  showToast({
                    body: () => (
                      <>
                        Something happen while user list invalidation
                        <br />
                        {JSON.stringify(error)}
                      </>
                    ),
                  });
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
            },
          );
        }}
      />
    </div>
  );
});
AddUser.displayName = 'AddUser';
