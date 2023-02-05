import { RootPage } from '.';
import { createRoute } from '../_internals/createRoute';

export const rootPageRoute = createRoute<RootPage>({
  path: '/',
  mapURLParamsToPage: () => ({ name: 'root' }),
});
