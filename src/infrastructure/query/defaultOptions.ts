import { DefaultOptions } from 'react-query';

/**
 * Just some reasonable default options for react-query
 */
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    keepPreviousData: true,

    retry: false,
    retryOnMount: false,

    suspense: true,

    // @TODO fix than there will be any instructions to work with errorBoundary and piping
    useErrorBoundary: false,
  },
};
