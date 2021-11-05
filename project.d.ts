// Global object / window variables
interface Window {
  __initialReduxState: any;
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __cfg: any;
  onunhandledrejection: (error: PromiseRejectionEvent) => void;

  __staticResourcesPathMapping: {
    pathMapping: Record<string, string[]>;
    inlineContent: string;
  };
  __session: object;
  __polyfillsSourceCode: {
    code: string;
  };
  __server_styles: string[];
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
