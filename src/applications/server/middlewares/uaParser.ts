import { Request, Response, NextFunction } from 'express';
import useragent from 'express-useragent';

export function UAParser(mutableReq: Request, _res: Response, next: NextFunction) {
  // Default will be Chrome on Windows
  const ua =
    mutableReq.get('User-Agent') ||
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36';

  mutableReq.parsedUA = useragent.parse(ua);

  return next();
}
