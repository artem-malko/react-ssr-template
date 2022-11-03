import { createRoute } from 'application/main/routing/utils';

import { RootPage } from '.';

export const rootPageRoute = createRoute<RootPage>({
  path: '/',
  mapURLToPage: () => ({ name: 'root' }),
});
