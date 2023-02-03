import { createRouteCreator } from 'framework/infrastructure/router/createRouteCreator';

import { Page } from '../types';

export const createRoute = createRouteCreator<Page>();
