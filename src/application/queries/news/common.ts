import { UseInfinityNewsParams } from './fetch/useInfinityNews';
import { UseNewsItemParams } from './fetch/useNewsItem';
import { UsePaginatedNewsParams } from './fetch/usePaginatedNews';

export const newsQueryKeys = {
  all: () => ['news'],
  byId: (params: UseNewsItemParams) => [...newsQueryKeys.all(), 'byId', params],
  allLists: () => [...newsQueryKeys.all(), 'list'],
  allPaginatedLists: () => [...newsQueryKeys.allLists(), 'paginated'],
  paginatedListByParams: (params: UsePaginatedNewsParams) => [
    ...newsQueryKeys.allPaginatedLists(),
    params,
  ],
  allInfinityLists: () => [...newsQueryKeys.allLists(), 'infinity'],
  infinityListByParams: (params: UseInfinityNewsParams) => [...newsQueryKeys.allInfinityLists(), params],
};
