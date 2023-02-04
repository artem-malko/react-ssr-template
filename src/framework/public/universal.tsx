/**
 * Universal functions/constants are exported here
 *
 * You can use it on a client side and on a server side as well
 */

export { createRequest } from 'framework/infrastructure/request';
export { createAppLogger } from 'framework/applications/shared/logger';

export { useAppLogger } from 'framework/infrastructure/logger/react/hook';

export { useAnyConfig } from 'framework/config/react';

export { useAnyPage } from 'framework/infrastructure/router/hooks/useAnyPage';

export { useCommonNavigate } from 'framework/infrastructure/router/hooks/useCommonNavigate';

export { useURLQuery } from 'framework/infrastructure/router/hooks/useURLQueryParams';

export { createRouteCreator } from 'framework/infrastructure/router/createRouteCreator';
export { createURLCompiler } from 'framework/infrastructure/router/compileURL';

export { useCommonAppQuery } from 'framework/infrastructure/query/useCommonAppQuery';
export { useInfiniteCommonAppQuery } from 'framework/infrastructure/query/useInfiniteCommonAppQuery';

export { usePlatformAPI } from 'framework/infrastructure/platform/shared/context';

export { useSession } from 'framework/infrastructure/session/hook';

export { createLazyComponentLoader } from 'framework/infrastructure/lazy';
export { RaiseError } from 'framework/infrastructure/raise/react/component';

export { DATA_T_ATTRIBUTE_NAME, dt } from 'framework/infrastructure/tests/dom/dt';
