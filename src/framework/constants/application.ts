/**
 * Can be rewrited via env-var APPLICATION_CONTAINER_ID
 */
export const ApplicationContainerId = process.env.APPLICATION_CONTAINER_ID || '__application';

/**
 * Can be rewrited via env-var SERVER_UTILITY_ROUTER_PATH
 */
export const utilityRouterPath = process.env.SERVER_UTILITY_ROUTER_PATH || '/_';
