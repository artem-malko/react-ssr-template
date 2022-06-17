import { DefaultOptions } from 'react-query';

/**
 * Just some reasonable default options for react-query
 */
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    /**
     * @TODO check this:
     * <Comp useQuery1>
     * {!ifFetching && <Comp1 useQuery1></Comp1>
     * </Comp>
     */
    refetchOnMount: true,

    keepPreviousData: true,

    // Actually, its ok to change this option to 3 times
    retry: false,
    retryOnMount: false,

    suspense: true,
    // As for me, it is much more easy to handle error near useQuery usage
    useErrorBoundary: false,
  },
};
