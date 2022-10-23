import { Action } from 'redux';

import { createSignal, parallel } from 'framework/infrastructure/signal';

/**
 * Signal, which will be dispatched before hydration
 * Caution, do not add any long tasks here!
 */
export const startup = createSignal('serverStartup', (params: { routerActions: Action<any>[] }) =>
  parallel(...params.routerActions),
);
