export type { NewsItem } from './types';

export { NewsItem as NewsItemComp } from './ui/item';

export { useNewsItemById } from './model/fetch/useNewsItemById';
export { useInfinityNewsList } from './model/fetch/useInfinityNewsList';
export { usePaginatedNewsList } from './model/fetch/usePaginatedNewsList';

export { useInvalidateAllNewsQueries } from './model/invalidate/useInvalidateAllNewsQueries';

export { useRefetchAllNewsQueries } from './model/refetch/useRefetchAllNewsQueries';

export { getNewsItemDataFromCache } from './model/cache/getNewsItemDataFromCache';
