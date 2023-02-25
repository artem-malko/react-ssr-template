import { NewsItemPage } from '.';
import { createRouteConfig } from '../_internals';

export const newsItemPageRouteConfig = createRouteConfig<NewsItemPage, 'id'>({
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
