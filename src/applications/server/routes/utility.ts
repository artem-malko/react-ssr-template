import { cookies } from 'config/constants';
import { Router } from 'express';
import { handleLogFromClient } from 'infrastructure/logger/serverLog';
import { fakeCRUDRouter } from '../services/fakeCrud';

export const utilityRouter = Router();

utilityRouter.get('/healthcheck', (_req, res) => res.status(200).send('OK'));

utilityRouter.post('/log', (req, res) => {
  handleLogFromClient(req, {
    sidCookieName: cookies.sid.name,
    userCookieName: cookies.user.name,
  });
  res.json({ status: 'ok' });
});

utilityRouter.use('/fakecrud', fakeCRUDRouter);
