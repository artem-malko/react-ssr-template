import { openPage } from 'core/actions/appContext/openPage';
import { RouteWithoutParams, Route } from 'infrastructure/router/types';
import { RootPage } from './';

export const rootPageRoute: Route<RouteWithoutParams, RootPage> = {
  path: '/',
  signal: () => openPage({ name: 'root' }),
};