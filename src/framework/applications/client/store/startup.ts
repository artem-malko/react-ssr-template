import { historyReplace } from 'framework/infrastructure/router/redux/actions/router';
import { createSignal } from 'framework/infrastructure/signal';

/**
 * Signal, which will be dispatched before hydration
 * Caution, do not add any long tasks here!
 */
export const startup = createSignal('clientStartup', () => historyReplace());
