import type { BaseApplicationConfig, BaseServerConfig } from 'framework/public/types';

// Can be used on server side only to configure a server, which serve application
export interface ServerConfig extends BaseServerConfig {
  port: number;
}

// Can be used on client and server side to configure application
export interface ApplicationConfig extends BaseApplicationConfig {
  networkTimeout: number;

  // HackerNews API URL
  hackerNewsApiUrl: string;

  // Fake API to demonstrate all @tanstack/react-querys advantages
  fakeCrudApi: string;
}
