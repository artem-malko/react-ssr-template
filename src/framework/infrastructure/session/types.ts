export type SearchBotName = 'google' | 'yandex' | 'bing' | 'mail';

export interface Session {
  ip: string;
  user: string;
  sid: string;
  userAgent: string;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isSearchBot?: boolean;
  searchBotName?: SearchBotName;
}
