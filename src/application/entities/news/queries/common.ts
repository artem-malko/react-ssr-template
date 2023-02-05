import { UseInfinityNewsParams } from './fetch/useInfinityNews';
import { UseNewsItemParams } from './fetch/useNewsItem';
import { UsePaginatedNewsParams } from './fetch/usePaginatedNews';

export const newsQueryKeys = {
  all: () => ['news'] as const,
  byId: (params: UseNewsItemParams) => [...newsQueryKeys.all(), 'byId', params] as const,
  allLists: () => [...newsQueryKeys.all(), 'list'] as const,
  allPaginatedLists: () => [...newsQueryKeys.allLists(), 'paginated'] as const,
  paginatedListByParams: (params: UsePaginatedNewsParams) =>
    [...newsQueryKeys.allPaginatedLists(), params] as const,
  allInfinityLists: () => [...newsQueryKeys.allLists(), 'infinity'] as const,
  infinityListByParams: (params: UseInfinityNewsParams) =>
    [...newsQueryKeys.allInfinityLists(), params] as const,
};
