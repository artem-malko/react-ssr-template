import { useMutation } from '@tanstack/react-query';

import { UserStatus } from 'application/services/fake/types';
import { useServices } from 'application/services/shared/context';

export const useAddUser = () => {
  const services = useServices();

  return useMutation((userToAdd: { name: string; status: UserStatus }) => {
    return services.fakeAPI.addUser({
      user: userToAdd,
    });
  });
};
