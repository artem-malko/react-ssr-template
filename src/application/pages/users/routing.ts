import { UserStatus } from 'application/shared/services/fake/types';
import { parsePageQueryParam } from 'application/shared/utils/routing/parsePageQueryParam';

import { UsersPage } from '.';
import { createRoute } from '../_internals/createRoute';

import type { URLQueryParams } from 'framework/public/types';

const filterQueryParamName = 'filter[status]';

export const usersPageRoute = createRoute<UsersPage>({
  path: '/users',
  mapURLParamsToPage: (_, queryParams) => ({
    name: 'users',
    params: {
      page: parsePageQueryParam(queryParams),
      activeUserId: queryParams['userId'] && queryParams['userId'][0],
      filterStatus: parseFilterStatus(queryParams),
    },
  }),
  mapPageToURLParams: ({ page, activeUserId, filterStatus }) => {
    return {
      query: {
        p: [page.toString()],
        userId: [activeUserId],
        'filter[status]': filterStatus || [],
      },
    };
  },
});

function parseFilterStatus(queryParams: URLQueryParams): UserStatus[] {
  return (queryParams[filterQueryParamName] || []).reduce<UserStatus[]>((mutableRes, param) => {
    switch (param) {
      case 'active':
      case 'banned':
      case 'inactive':
        mutableRes.push(param);
        break;
      default:
        return mutableRes;
    }

    return mutableRes;
  }, []);
}
