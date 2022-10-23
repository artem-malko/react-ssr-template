import { createSignal, parallel } from 'framework/infrastructure/signal';
import { Action } from 'redux';

/**
 * Signal, which will be dispatched before hydration
 * Caution, do not add any long tasks here!
 */
export const startup = createSignal('serverStartup', (params: { routerActions: Action<any>[] }) =>
  parallel(...params.routerActions),
);
