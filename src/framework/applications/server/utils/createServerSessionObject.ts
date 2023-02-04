import { Request, Response } from 'express';
import { v4 } from 'uuid';

import { frameworkCookies } from 'framework/constants/cookies';
import { defaultSession } from 'framework/infrastructure/session/context';
import { Session } from 'framework/infrastructure/session/types';
import { createCookieAPI } from 'lib/cookies/server';

export const createServerSessionObject = (req: Request, res: Response): Session => {
  const userAgentHeader = req.headers['user-agent'];
  const userAgent =
    userAgentHeader && Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader || '';
  const searchBotData = req.searchBotData;
  const cookiesAPI = createCookieAPI(req, res);

  let sid = cookiesAPI.get(frameworkCookies.sid.name) || '';

  if (!sid) {
    sid = v4();
    cookiesAPI.set(frameworkCookies.sid.name, sid, frameworkCookies.sid.options);
  }

  let user = cookiesAPI.get(frameworkCookies.user.name) || '';

  if (!user) {
    user = v4();
    cookiesAPI.set(frameworkCookies.user.name, user, frameworkCookies.user.options);
  }

  const sessionData: Session = {
    ...defaultSession,
    user,
    sid,
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
