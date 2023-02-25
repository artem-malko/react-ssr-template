import type { URLQueryParams } from 'framework/public/types';

import { UserStatus } from 'application/entities/domain/user';

import { parsePageQueryParam } from 'application/shared/lib/routing';

import { UsersPage } from '.';
import { createRouteConfig } from '../_internals';

const filterQueryParamName = 'filter[status]';

export const usersPageRouteConfig = createRouteConfig<UsersPage>({
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
