export type AnyConfigValue = string | boolean | number;
// @TODO AnyConfig as a parent for BaseConfig?
export interface AnyConfig {
  [key: string]: AnyConfigValue;
}

export interface BaseServerConfig {
  /**
   *
   */
  port: number;
  publicPath: string;
}

export interface BaseApplicationConfig {
  publicPath: string;
}
