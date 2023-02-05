import { NewsItemPage } from '.';
import { createRoute } from '../_internals/createRoute';

export const newsItemPageRoute = createRoute<NewsItemPage, { id: string }>({
  path: '/news/:id',
  mapURLParamsToPage: ({ id: rawId }) => {
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
});
