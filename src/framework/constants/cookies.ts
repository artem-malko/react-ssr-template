import { CookieOptions } from 'express';
import { CookieAttributes } from 'js-cookie';

type FrameworkCookieName = 'user' | 'sid' | 'pushedResources';
export const frameworkCookies: FrameworkCookies = {
  // Unic uuid for every user. This uuid will be the same through many sessions
  user: {
    name: '_application_user',
    options: {
      path: '/',
      sameSite: 'strict',
      // 50 years
      maxAge: 1576800000,
    },
  },

  // Unic uuid for every new session
  sid: {
    name: '_application_sid',
    options: {
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

type FrameworkCookies = {
  [key in FrameworkCookieName]: {
    name: string;
    options: CookieOptions | CookieAttributes;
  };
};
