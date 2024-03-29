/**
 * Universal functions/constants are exported here
 *
 * You can use it on a client side and on a server side as well
 */

export { createRequest } from 'framework/infrastructure/request';
export { createAppLogger } from 'framework/applications/shared/logger';

export { useAppLogger } from 'framework/infrastructure/logger/react/hook';

export { useAnyConfig } from 'framework/config/react';

export { useAnyActivePage } from 'framework/infrastructure/router/hooks/useAnyActivePage';

export { useCommonNavigate } from 'framework/infrastructure/router/hooks/useCommonNavigate';

export { useCommonURLQuery } from 'framework/infrastructure/router/hooks/useURLQueryParams';

export { createRouteConfigCreator } from 'framework/infrastructure/router/createRouteConfigCreator';
export { bindRouteConfigToPathCreator } from 'framework/infrastructure/router/bindRouteConfigToPathCreator';
export { createURLCompiler } from 'framework/infrastructure/router/compileURL';

export {
  type UseAnyAppSuspenseQueryOptions,
  useAnyAppSuspenseQuery,
} from 'framework/infrastructure/query/useAnyAppSuspenseQuery';
export {
  type UseAnyAppSuspenseInfiniteQueryOptions,
  useAnyAppSuspenseInfiniteQuery,
} from 'framework/infrastructure/query/useAnyAppSuspenseInfiniteQuery';

export { usePlatformAPI } from 'framework/infrastructure/platform/shared/context';

export { useSession } from 'framework/infrastructure/session/hook';

export { createLazyComponentLoader } from 'framework/infrastructure/lazy';
export { RaiseError } from 'framework/infrastructure/raise/react/component';

export { DATA_T_ATTRIBUTE_NAME, dt } from 'framework/infrastructure/tests/dom/dt';

export { type GetTitle } from 'framework/applications/client/types';

export { isParsedError } from 'framework/infrastructure/request/utils/is';
