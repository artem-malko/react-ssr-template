import { createApi } from 'application/shared/lib/api/createApi';

import { baseRequestParams } from './shared';
import { User } from '../types';

type ApiParams = { id: string };

type ApiResponse = {
  data: {
    user: User;
  };
};

export const getUserByIdApi = createApi<ApiParams, ApiResponse>(({ id }, { config, request }) => {
  return request(`${config.fakeCrudApi}/users/${id}`, {
    method: 'get',
    ...baseRequestParams,
  });
});
