import { Request } from 'express';

import { defaultSession } from 'framework/infrastructure/session/context';
import { Session } from 'framework/infrastructure/session/types';

export const createServerSessionObject = (req: Request): Session => {
  const userAgentHeader = req.headers['user-agent'];
  const userAgent =
    userAgentHeader && Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader || '';
  const searchBotData = req.searchBotData;

  const sessionData: Session = {
    ...defaultSession,
    ip: req.clientIp,
    userAgent,
    isIOS: req.parsedUA.isiPad || req.parsedUA.isiPhone || req.parsedUA.isiPod,
    isAndroid: req.parsedUA.isAndroid,
    isMobile: req.parsedUA.isMobile,
    isTablet: req.parsedUA.isTablet,
  };

  if (!searchBotData) {
    return sessionData;
  }

  return {
    ...sessionData,
    searchBotName: searchBotData.botName,
    isSearchBot: true,
  };
};