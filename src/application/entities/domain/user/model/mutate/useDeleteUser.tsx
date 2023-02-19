import { useMutation } from '@tanstack/react-query';

import { useApi } from 'application/shared/lib/api';

import { deleteUserApi } from '../../api/deleteUser';

export const useDeleteUser = () => {
  const deleteUser = useApi(deleteUserApi);

  return useMutation((params: { userId: string; name: string }) => {
    return deleteUser({ id: params.userId });
  });
};
