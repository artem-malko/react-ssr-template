export type AnyConfigValue = string | boolean | number;
export type AnyConfig = Record<string, AnyConfigValue>;

export interface BaseServerConfig extends AnyConfig {
  port: number;

  // Cookies
  searchBotCookieName: string;
  searchBotCookiePath: string;
  searchBotCookieDomain: string;
  searchBotCookieExpiresPeriod: number;
}

export interface BaseApplicationConfig extends AnyConfig {
  publicPath: string;
}
