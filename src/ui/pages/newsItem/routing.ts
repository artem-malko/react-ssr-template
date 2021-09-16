import { openPage } from 'core/signals/page';
import { Route, RouteWithParams } from 'infrastructure/router/types';
import { NewsItemPage } from '.';
import { openErrorPage } from '../error/signals';

export const newsItemPageRoute: Route<RouteWithParams<{ id: string }>, NewsItemPage> = {
  path: '/news/:id',
  signal: ({ id: rawId }) => {
    const id = parseInt(rawId, 10);

    if (Number.isNaN(id)) {
      return openErrorPage(404);
    }

    return openPage({
      name: 'newsItem',
      params: {
        id,
      },
    });
  },
};
