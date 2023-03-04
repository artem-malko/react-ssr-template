/**
 * Server-specific functions/constants are exported here
 *
 * You can use it on a server side only
 */

export { startServer } from '../applications/server';
export { createApplicationRouteHandler } from '../applications/server/createApplicationRouteHandler';

export {
  buildClientApplicationConfig,
  buildServerApplicationConfig,
  buildServerConfig,
} from '../config/generator/server';

export { createURLParser } from '../infrastructure/router/parseURL';

export { createCookieAPI } from '../infrastructure/platform/cookie/server';

export { type Metadata } from '../types/metadata';

export { type GetMetadata } from '../applications/server/types';
