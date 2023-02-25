import { bindRouteConfigToPathCreator, createRouteConfigCreator } from 'framework/public/universal';

import { Page } from 'application/pages/shared';

import { ErrorPage } from '../error';

export const createRouteConfig = createRouteConfigCreator<Page, ErrorPage>();
export const bindRouteConfigToPath = bindRouteConfigToPathCreator<Page>();
