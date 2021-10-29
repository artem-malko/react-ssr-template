import { Query, QueryClient } from 'react-query';
import { Writable } from 'stream';

/**
 * This is just a copy from react-query repo
 */
function dehydrateQuery(query: Query) {
  return {
    state: query.state,
    queryKey: query.queryKey,
    queryHash: query.queryHash,
  };
}

/**
 * This is a writeble Wrapper, which allows to insert into the stream
 * dehydratedQuery state exact at the right timing
 * right after react rendered  a component with query usage
 */
export class DehydrateQueryWritable extends Writable {
  private queryClient: QueryClient;
  // Used to check, that query was dehydrated
  private queryStorage: { [key: string]: boolean };
  // Used to check, that query was dehydrated
  private queriesCache: string[];
  private _writable: Writable;

  constructor(writable: Writable, queryClient: QueryClient) {
    super();
    this._writable = writable;
    this.queryClient = queryClient;
    this.queryStorage = {};
    this.queriesCache = [];
  }

  public _write(chunk: any, encoding: BufferEncoding, next?: (error: Error | null | undefined) => void) {
    const queryClientCache = this.queryClient.getQueryCache().getAll();

    /**
     * We have to do as less work as we can,
     * cause ssr speed depends on _writable.write execution time.
     * So, we will try to dehydrate query only in case
     * when there is more queries in queryClientCache than in queriesCache
     */
    if (queryClientCache.length !== this.queriesCache.length) {
      /**
       * Ok, queryClientCache has more queries to dehydrate, than we dehydrated already
       * Let's try to find a query ready to be dehydrated
       */
      const readyQuery = queryClientCache.find((q) => {
        return !q.state.isFetching && !this.queryStorage[q.queryHash];
      });

      /**
       * The query ready to be dehydrated was found.
       * Let's write its stringified value to the HTML
       *
       * This data will be used as an initialQueryState in the hydration process
       */
      if (readyQuery) {
        this.queryStorage[readyQuery.queryHash] = true;
        this.queriesCache.push(readyQuery.queryHash);

        this._writable.write(
          `<script>window[${JSON.stringify(readyQuery.queryHash)}] = ${JSON.stringify({
            queries: [dehydrateQuery(readyQuery)],
          })}</script>`,
        );
      }
    }

    // Finally write whatever React tried to write.
    this._writable.write(chunk, encoding, next);
  }

  /**
   * React uses `flush` to prevent stream middleware like gzip from buffering to the
   * point of harming streaming performance, so we make sure to expose it and forward it.
   * See: https://github.com/reactwg/react-18/discussions/91
   */
  public flush() {
    if (typeof (this._writable as any).flush === 'function') {
      (this._writable as any).flush();
    }
  }
}
