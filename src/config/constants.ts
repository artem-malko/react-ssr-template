import { CookieOptions } from 'express';
import { CookieAttributes } from 'js-cookie';

export const ApplicationContainerId = '__application';

// @REPLACE_ON_FORK
export const baseDomain = 'example.com';

type CookieName = 'user' | 'sid' | 'pushedResources';
export const cookies: Cookies = {
  // Unic uuid for every user. This uuid will be the same through many sessions
  user: {
    name: '_user',
    options: {
      domain: `.${baseDomain}`,
      path: '/',
      sameSite: 'strict',
      // 50 years
      maxAge: 1576800000,
    },
  },

  // Unic uuid for every new session
  sid: {
    name: '_sid',
    options: {
      domain: `.${baseDomain}`,
      path: '/',
      sameSite: 'strict',
    },
  },

  pushedResources: {
    name: 'pushed_resources',
    options: {
      sameSite: 'strict',
      // 31 days
      maxAge: 2678400,
    },
  },
};

type Cookies = {
  [key in CookieName]: {
    name: string;
    options: CookieOptions | CookieAttributes;
  };
};
