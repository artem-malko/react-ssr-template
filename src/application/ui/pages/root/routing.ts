import { AppRoute } from 'application/main/routing';
import { RouteWithoutParams } from 'framework/infrastructure/router/types';
import { RootPage } from '.';

export const rootPageRoute: AppRoute<RouteWithoutParams, RootPage> = {
  path: '/',
  mapURLToPage: () => ({ name: 'root' }),
};
