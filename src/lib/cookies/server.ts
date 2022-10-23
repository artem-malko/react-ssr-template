import { Request, Response, CookieOptions } from 'express';

import { Cookie } from './types';

export const createCookieAPI = (req: Request, res: Response): Cookie => ({
  set(name: string, value: string, options?: CookieOptions) {
    let opts = options || {};

    // Express takes maxAge in miliseconds
    if (options?.maxAge) {
      opts = {
        ...opts,
        maxAge: Math.round(options.maxAge * 1000),
      };
    }

    res.cookie(name, value, opts);
  },
  get(name: string) {
    return req.cookies[name];
  },

  delete(name: string, options?: CookieOptions) {
    return res.clearCookie(name, options);
  },
});
