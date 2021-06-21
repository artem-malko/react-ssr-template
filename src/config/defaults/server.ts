import { ServerConfig } from '../types';
import { baseDomain } from '../constants';

export const defaultServerConfig: ServerConfig = {
  port: 4000,

  // highly recommended to override with option via SERVER_SEARCH_BOT_COOKIE_NAME env var
  searchBotCookieName: '_is_search_bot',
  searchBotCookieDomain: `.${baseDomain}`,
  searchBotCookiePath: '/',
  // 50 years
  searchBotCookieExpiresPeriod: 1576800000,
};
