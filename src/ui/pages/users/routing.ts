import { UserStatus } from 'core/services/fake/types';
import { openPageSignal } from 'core/signals/page';
import { Route, RouteWithoutParams, URLQueryParams } from 'infrastructure/router/types';
import { parsePageQueryParam } from 'ui/utils/routing/parsePageQueryParam';
import { UsersPage } from '.';

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
      filter: [filterStatus],
    };
  },
};

function parseFilterStatus(queryParams: URLQueryParams): UserStatus | undefined {
  const rawFilterStatusParam = queryParams['filter'] && queryParams['filter'][0];

  switch (rawFilterStatusParam) {
    case 'acitve':
    case 'banned':
    case 'inactive':
      return rawFilterStatusParam;
    default:
      return;
  }
}
