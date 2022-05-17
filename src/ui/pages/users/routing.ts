import { UserStatus } from 'core/services/fake/types';
import { openPageSignal } from 'core/signals/page';
import { Route, RouteWithoutParams, URLQueryParams } from 'infrastructure/router/types';
import { parsePageQueryParam } from 'ui/utils/routing/parsePageQueryParam';
import { UsersPage } from '.';

const filterQueryParamName = 'filter[status]';

export const usersPageRoute: Route<RouteWithoutParams, UsersPage> = {
  path: '/users',
  signal: (_, queryParams) => {
    return openPageSignal({
      name: 'users',
      params: {
        page: parsePageQueryParam(queryParams),
        activeUserId: queryParams['userId'] && queryParams['userId'][0],
        filterStatus: parseFilterStatus(queryParams),
      },
    });
  },
  matchPageToQueryParams: ({ page, activeUserId, filterStatus }) => {
    return {
      p: [page.toString()],
      userId: [activeUserId],
      'filter[status]': filterStatus || [],
    };
  },
};

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
