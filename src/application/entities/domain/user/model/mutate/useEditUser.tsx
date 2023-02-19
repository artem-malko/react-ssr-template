import { useMutation } from '@tanstack/react-query';

import { useApi } from 'application/shared/lib/api';

import { patchUserApi } from '../../api/patchUser';
import { UserStatus } from '../../types';

export const useEditUser = () => {
  const patchUser = useApi(patchUserApi);

  return useMutation((userToUpdate: { id: string; name: string; status: UserStatus }) => {
    return patchUser({
      user: userToUpdate,
    });
  });
};
