import { createRoute } from 'application/main/routing/utils';

import { RootPage } from '.';

export const rootPageRoute = createRoute<RootPage>({
  path: '/',
  mapURLParamsToPage: () => ({ name: 'root' }),
});
