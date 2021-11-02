import { SearchBotName } from 'core/types/http';

export interface Session {
  ip: string;
  userAgent: string;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isSearchBot?: boolean;
  searchBotName?: SearchBotName;
  screen: {
    width: number;
    height: number;
  };
}
