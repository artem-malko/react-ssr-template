import { Request, Response, NextFunction } from 'express';

export function clientIp(mutableReq: Request, _res: Response, next: NextFunction) {
  mutableReq.clientIp =
    mutableReq.get('x-forwarded-for') ||
    mutableReq.get('x-real-ip') ||
    mutableReq.socket.remoteAddress ||
    mutableReq.ip;
  return next();
}
