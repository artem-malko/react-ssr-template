// Global object / window variables
interface Window {
  __initialReduxState: any;
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __cfg: any;
  onunhandledrejection: (error: PromiseRejectionEvent) => void;

  __staticResourcesPathMapping: {
    [asset: string]: string[];
  };
  __session: object;
}

declare namespace Express {
  interface Request {
    parsedUA: import('express-useragent').Details;
    clientIp: string;
    isSearchBot: boolean;
    searchBotData?: {
      botName: 'google' | 'yandex' | 'bing' | 'mail';
    };
  }
}
