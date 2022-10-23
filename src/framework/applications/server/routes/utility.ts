import { Router } from 'express';

import { frameworkCookies } from 'framework/constants/cookies';
import { handleLogFromClient } from 'framework/infrastructure/logger/serverLog';

export const utilityRouter = Router();

utilityRouter.get('/healthcheck', (_req, res) => res.status(200).send('OK'));

utilityRouter.post('/log', (req, res) => {
  handleLogFromClient(req, {
    sidCookieName: frameworkCookies.sid.name,
    userCookieName: frameworkCookies.user.name,
  });
  res.json({ status: 'ok' });
});
