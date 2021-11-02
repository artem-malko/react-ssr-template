import { createContext } from 'react';
import { Session } from './types';

export const defaultSession: Session = {
  ip: '',
  userAgent: '',
  isIOS: false,
  isAndroid: false,
  isMobile: false,
  isTablet: false,
  screen: {
    width: 1366,
    height: 768,
  },
};

export const SessionContext = createContext<Session>(defaultSession);
