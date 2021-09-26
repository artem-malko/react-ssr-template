import { CookieOptions } from 'express';
import { CookieAttributes } from 'js-cookie';

export interface Cookie {
  set(name: string, value: string, options?: CookieOptions | CookieAttributes): void;
  get(name: string): string | undefined;
  delete(name: string, options?: CookieOptions | CookieAttributes): void;
}

export interface NamedCookie extends CookieOptions {
  name: string;
}

export interface NamedCookieConfig {
  name: string;
  maxAge?: number;
  signed?: boolean;
  expiresPeriod?: number;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean | 'auto';
  encode?: (val: string) => void;
  sameSite?: boolean | string;
}
