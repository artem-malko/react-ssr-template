import { createRouteCreator } from 'framework/public/universal';

import { Page } from 'application/pages/shared';

import { ErrorPage } from '../error';

export const createRoute = createRouteCreator<Page, ErrorPage>();
