// Global object / window variables
interface Window {
  initialState: any;
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __cfg: any;
  onunhandledrejection: (error: PromiseRejectionEvent) => void;

  MSStream: any;

  initErrorsStack?: Error[];
  pathMapping: {
    [asset: string]: string[];
  };
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
