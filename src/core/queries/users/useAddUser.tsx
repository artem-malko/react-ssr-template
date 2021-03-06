import { UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useMutation } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { useUserQueriesInvalidate } from './common';

export const useAddUser = () => {
  const { showToast } = useToast();
  const services = useServices();
  const invalidateUsers = useUserQueriesInvalidate();

  return useMutation(
    (userToAdd: { name: string; status: UserStatus }) => {
      return services.fakeAPI.addUser({
        user: userToAdd,
      });
    },
    {
      onSuccess() {
        showToast({
          body: () => <>User with name {name} has been added</>,
        });
        invalidateUsers().catch((error) => {
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
};
