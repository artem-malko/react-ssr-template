import { Page } from 'core/store/types';
import { Routes } from 'infrastructure/router/types';
import { errorPageRoute } from 'ui/pages/error/routing';
import { rootPageRoute } from 'ui/pages/root/routing';

export type AppRoutes = Routes<Page>;

export const routes: AppRoutes = {
  root: rootPageRoute,
  error: errorPageRoute,
};
