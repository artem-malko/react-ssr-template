import { RootPage } from '.';
import { createRouteConfig } from '../_internals';

export const rootPageRouteConfig = createRouteConfig<RootPage>({
  mapURLParamsToPage: () => ({ name: 'root' }),
});
