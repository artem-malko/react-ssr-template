import { DefaultOptions, keepPreviousData } from '@tanstack/react-query';

/**
 * Just some reasonable default options for react-query
 */
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    networkMode: 'offlineFirst',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    /**
     * @TODO check this:
     * <Comp useQuery1>
     * {!ifFetching && <Comp1 useQuery1></Comp1>
     * </Comp>
     */
    refetchOnMount: true,

    placeholderData: keepPreviousData,

    /**
     * Actually, its ok to change this option to 3 times
     */
    retry: false,

    /**
     * Works for useQuery, useInfinityQuery and mutations only
     *
     * For useSuspense and useSuspenseInfinityQuery with option is useless
     * https://tanstack.com/query/latest/docs/react/guides/suspense#throwonerror-default
     */
    throwOnError: false,
  },
};
