
import { AppRoute } from 'application/main/routing';
import { RouteWithParams } from 'framework/infrastructure/router/types';

import { NewsItemPage } from '.';

export const newsItemPageRoute: AppRoute<RouteWithParams<{ id: string }>, NewsItemPage> = {
  path: '/news/:id',
  mapURLToPage: ({ id: rawId }) => {
    const id = parseInt(rawId, 10);

    if (Number.isNaN(id)) {
      return {
        name: 'error',
        params: { code: 404 },
      };
    }

    return {
      name: 'newsItem',
      params: {
        id,
      },
    };
  },
};
