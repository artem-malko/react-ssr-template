import express from 'express';

export const createApplicationRouter: () => express.Handler = () => (_req, res) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-XSS-Protection', '1');
  res.set('X-Frame-Options', 'deny');

  res.send(200);
};
