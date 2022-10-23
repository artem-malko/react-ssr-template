import { AnyConfig } from 'framework/config/types';

// Can be used on server side only to configure a server, which serve application
export interface ServerConfig extends AnyConfig {
  port: number;

  // Cookies
  searchBotCookieName: string;
  searchBotCookiePath: string;
  searchBotCookieDomain: string;
  searchBotCookieExpiresPeriod: number;
}

// Can be used on client and server side to configure application
export interface ApplicationConfig extends AnyConfig {
  networkTimeout: number;
  publicPath: string;

  // HackerNews API URL
  hackerNewsApiUrl: string;

  // Fake API to demonstrate all @tanstack/react-querys advantages
  fakeCrudApi: string;
}
