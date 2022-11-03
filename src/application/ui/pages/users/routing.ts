import { createRoute } from 'application/main/routing/utils';
import { UserStatus } from 'application/services/fake/types';
import { parsePageQueryParam } from 'application/ui/utils/routing/parsePageQueryParam';
import { URLQueryParams } from 'framework/infrastructure/router/types';

import { UsersPage } from '.';

const filterQueryParamName = 'filter[status]';

export const usersPageRoute = createRoute<UsersPage>({
  path: '/users',
  mapURLToPage: (_, queryParams) => ({
    name: 'users',
    params: {
      page: parsePageQueryParam(queryParams),
      activeUserId: queryParams['userId'] && queryParams['userId'][0],
      filterStatus: parseFilterStatus(queryParams),
    },
  }),
  mapPageToQueryParams: ({ page, activeUserId, filterStatus }) => {
    return {
      p: [page.toString()],
      userId: [activeUserId],
      'filter[status]': filterStatus || [],
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
