import { openPage } from 'core/actions/appContext/openPage';
import { Route, RouteWithParams } from 'infrastructure/router/types';
import { NewsItemPage } from '.';

export const newsItemPageRoute: Route<RouteWithParams<{ id: string }>, NewsItemPage> = {
  path: '/news/:id',
  signal: ({ id }) => {
    return openPage({
      name: 'newsItem',
      params: {
        id,
      },
    });
  },
};
