import { historyReplace } from 'infrastructure/router/actions';
import { createSignal } from 'infrastructure/signal';

/**
 * Signal, which will be dispatched before hydration
 * Caution, do not add any long tasks here!
 */
export const startup = createSignal('clientStartup', () => historyReplace());
