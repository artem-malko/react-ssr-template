// Can be used on server side only to configure a server, which serve application
export interface ServerConfig {
  port: number;

  // Cookies
  searchBotCookieName: string;
  searchBotCookiePath: string;
  searchBotCookieDomain: string;
  searchBotCookieExpiresPeriod: number;
}

// Can be used on client and server side to configure application
export interface ApplicationConfig {
  networkTimeout: number;
  publicPath: string;

  // HackerNews API URL
  hackerNewsAPIURL: string;
}
