interface NewsItem {
  id: number;
  title: string;
  user: string;
  time: number;
  time_ago: string;
  url: string;
}

export type FetchNewsResponse = NewsItem[];
export type FetchNewsItemResponse = NewsItem;
