import { createRouteCreator } from 'framework/public/universal';

import { ErrorPage } from '../error';
import { Page } from '../shared';

export const createRoute = createRouteCreator<Page, ErrorPage>();
