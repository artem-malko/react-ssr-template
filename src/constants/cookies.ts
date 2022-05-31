import { CookieOptions } from 'express';

type CookieDescription = {
  name: string;
  options?: CookieOptions;
};

export const useErrorsInFakeAPI: CookieDescription = {
  name: 'useErrorsInFakeAPI',

  options: {
    // 1 day
    maxAge: 24 * 60 * 60,
  },
};

export const useRandomLatencyInFakeAPI: CookieDescription = {
  name: 'useRandomLatencyInFakeAPI',
  options: {
    // 1 day
    maxAge: 24 * 60 * 60,
  },
};
