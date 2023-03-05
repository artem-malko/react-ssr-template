export type AnyConfigValue = string | boolean | number;
// @TODO AnyConfig as a parent for BaseConfig?
export interface AnyConfig {
  [key: string]: AnyConfigValue;
}

export interface BaseServerConfig {
  /**
   * A port for an express server
   */
  port: number;
}

export interface BaseApplicationConfig {
  publicPath: string;
}
