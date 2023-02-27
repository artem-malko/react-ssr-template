/**
 * Universal types are exported here
 *
 * You can use it on a client side and on a server side as well
 */

export type { BaseApplicationConfig, BaseServerConfig } from 'framework/config/types';

export type {
  AnyAppContext,
  AnyPage,
  URLQueryParams,
  Routes,
  ClientRouter,
  ServerRouter,
} from 'framework/infrastructure/router/types';

export type { ParsedError, Requester } from 'framework/infrastructure/request/types';

export type { AppLogger } from 'framework/infrastructure/logger';

export type { AllowedInlineStyle } from 'framework/infrastructure/css/types';
