import { createApi } from 'application/shared/lib/api/createApi';

import { baseRequestParams } from './shared';
import { User } from '../types';

type ApiParams = { user: Omit<User, 'id'> };

type ApiResponse = {
  data: {
    id: string;
  };
};

export const postUserApi = createApi<ApiParams, ApiResponse>(({ user }, { config, request }) => {
  return request(`${config.fakeCrudApi}/users`, {
    method: 'post',
    body: user,
    ...baseRequestParams,
  });
});
