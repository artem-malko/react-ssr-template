import { createContext } from 'react';

import { Session } from './types';

export const defaultSession: Session = {
  ip: '',
  user: '',
  sid: '',
  userAgent: '',
  isIOS: false,
  isAndroid: false,
  isMobile: false,
  isTablet: false,
};

export const SessionContext = createContext<Session>(defaultSession);
