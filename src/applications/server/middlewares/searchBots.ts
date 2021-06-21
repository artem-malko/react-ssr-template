import dns from 'dns';
import { Request, Response, NextFunction } from 'express';

const botAgentsMap: {
  [key: string]: 'google' | 'yandex' | 'bing' | 'mail';
} = {
  Googlebot: 'google',
  Mediapartners: 'google',
  AdsBot: 'google',
  'yandex.com/bots': 'yandex',
  'search.msn.com/msnbot.htm': 'bing',
  'bing.com/bingbot.htm': 'bing',
  BingPreview: 'bing',
  'Mail.RU_Bot': 'mail',
};
function isHostBot(host: string) {
  const botHostsList = [
    /googlebot\.com$/, // google
    /google\.com$/, // google
    /search\.msn.com$/, // bing
    /yandex\.ru$/, // yandex
    /yandex\.net$/, // yandex
    /yandex\.com$/, // yandex
    /mail\.ru$/, // mail
  ];
  return botHostsList.some((botHost) => !!host.match(botHost));
}

export function isSearchBot(mutableReq: Request, _res: Response, next: NextFunction) {
  const userAgent = mutableReq.get('User-Agent') || '';
  const clientIP = mutableReq.clientIp;
  const searchBotAgent: string | undefined = Object.keys(botAgentsMap).find(
    (agent) => userAgent.indexOf(agent) !== -1,
  );
  mutableReq.isSearchBot = false;

  if (!searchBotAgent) {
    next();
    return;
  }

  dns.reverse(clientIP, (err: NodeJS.ErrnoException | null, hostnames: string[]) => {
    if (err) {
      next();
      return;
    }

    // Do lookup if one of hostname is equal to one from botHostsList
    const isSearchBotHost = hostnames.length > 0 && hostnames.some((host) => isHostBot(host));
    if (!isSearchBotHost) {
      next();
      return;
    }

    const lookupAll = hostnames.map(
      (host) =>
        new Promise((resolve) =>
          dns.lookup(host, (_err: NodeJS.ErrnoException | null, address: string) => {
            resolve(address);
          }),
        ),
    );
    Promise.all(lookupAll)
      .then((data) => {
        // check bot IP and lookup results
        mutableReq.isSearchBot = !!data.find((address) => address === clientIP);
        const botName = botAgentsMap[searchBotAgent];

        if (mutableReq.isSearchBot && botName) {
          mutableReq.searchBotData = {
            botName,
          };
        }
        next();
      })
      .catch(next);
  });
}
