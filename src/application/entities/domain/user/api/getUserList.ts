import { createApi } from 'application/shared/lib/api';

import { baseRequestParams } from './shared';
import { User, UserStatus } from '../types';

type ApiParams = { page: number; status?: UserStatus[] };

type ApiResponse = {
  data: {
    users: User[];
    total: number;
  };
};

export const getUserListApi = createApi<ApiParams, ApiResponse>((params, { config, request }) => {
  const { page, status } = params;
  const limit = 10;
  const offset = (page - 1) * limit;
  const URLWithoutStatus = `${config.fakeCrudApi}/users?limit=${limit}&offset=${offset}`;

  return request(
    status?.length
      ? `${URLWithoutStatus}&${status.map((s) => `status=${s}`).join('&')}`
      : URLWithoutStatus,
    {
      method: 'get',
      ...baseRequestParams,
    },
  );
});
