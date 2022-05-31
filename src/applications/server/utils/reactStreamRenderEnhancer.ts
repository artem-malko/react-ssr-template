import { generateCss } from 'infrastructure/css/generator';
import { CSSServerProviderStore } from 'infrastructure/css/provider/serverStore';
import { Query, QueryClient } from 'react-query';
import { Writable } from 'node:stream';

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
 * This is a writeble Wrapper, which allows to insert into the stream:
 * 1. dehydratedQuery state exact at the right timing
 *    right after react rendered  a component with query usage
 *
 * 2. generated css right after react rendered  a component with styles
 */
export class ReactStreamRenderEnhancer extends Writable {
  private queryClient: QueryClient;
  // Used to check, that query was dehydrated
  private queryStorage: { [key: string]: boolean };
  // Used to check, that query was dehydrated
  private queriesCache: string[];
  private _writable: Writable;
  private cssProviderStore: CSSServerProviderStore;

  constructor(writable: Writable, queryClient: QueryClient, cssProviderStore: CSSServerProviderStore) {
    super();
    this._writable = writable;
    this.queryClient = queryClient;
    this.cssProviderStore = cssProviderStore;
    this.queryStorage = {};
    this.queriesCache = [];
  }

  public _write(chunk: any, encoding: BufferEncoding, next?: (error: Error | null | undefined) => void) {
    if (this._writable.destroyed) {
      return;
    }

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
        // @TODO Do we need to use fetchStatus?
        return q.state.status === 'success' && !this.queryStorage[q.queryHash];
      });

      /**
       * The query ready to be dehydrated was found.
       * Let's write its stringified value to the HTML
       *
       * This data will be used as an initialQueryState in the hydration process
       */
      if (readyQuery && isItSafeToWrite(chunk)) {
        this.queryStorage[readyQuery.queryHash] = true;
        this.queriesCache.push(readyQuery.queryHash);

        const randomScriptElementVarName = generateRandomId('__script');
        const queryHash = JSON.stringify(readyQuery.queryHash);
        const queryData = JSON.stringify({
          queries: [dehydrateQuery(readyQuery)],
        });
        const scriptContent = JSON.stringify(`window[${queryHash}] = ${queryData}`);
        /**
         * This script executes right before the next chunk
         * so nothing else can observe it. Including React.
         * This script creates style element, adds queryData and removes itself from the dom
         * So, hydration won't be broken.
         */
        this._writable.write(
          wrapWithImmediateScript(`
            var ${randomScriptElementVarName} = document.createElement('script');
            ${randomScriptElementVarName}.innerHTML = ${scriptContent};
            document.body.appendChild(${randomScriptElementVarName});
          `),
        );
      }
    }

    /**
     * This should pick up any new styles that hasn't been previously
     * written to this stream.
     */
    if (this.cssProviderStore.hasStyles() && isItSafeToWrite(chunk)) {
      const styles = this.cssProviderStore.getStyles();
      const randomStyleElementVarName = generateRandomId('__style');
      const randomStyleIdName = generateRandomId('__style_id');

      /**
       * This script executes right after inserting it to the dom
       * so nothing else can observe it. Including React.
       * This script creates style element, adds css-rules and removes itself from the dom
       * So, hydration won't be broken, cause head tag was streamed before the application
       *
       * Write it before the HTML to ensure that the CSS is available and
       * blocks display before the HTML that shows it.
       */
      this._writable.write(
        wrapWithImmediateScript(`
        var ${randomStyleElementVarName} = document.createElement('style');
        ${randomStyleElementVarName}.innerHTML = '${generateCss(styles)}';
        ${randomStyleElementVarName}.setAttribute('id', '${randomStyleIdName}');
        document.head.appendChild(${randomStyleElementVarName});
      `),
      );

      /**
       * We have to clear store, to prevent generating already sent styles
       */
      this.cssProviderStore.clearStore();
    }

    // Finally write whatever React tried to write.
    this._writable.write(chunk, encoding, next);

    /**
     * Note: React can write fractional HTML chunks so it's not safe
     * to always inject HTML anywhere in a write call.
     * The above technique relies on the fact
     * that React won't render anything in between writing. We assume that no
     * more link tags or script tags will be collected between fractional writes.
     * It is not safe to write things after React
     * since there can be another write call coming after it.
     */
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

/**
 * Creates script, which executes right before the next chunk
 * so nothing else can observe it. Including React.
 *
 * This script has to be removed after execution, cause of server and client rendering mismatch warn
 */
function wrapWithImmediateScript(code: string) {
  const randomScriptId = generateRandomId();

  return `<script id="${randomScriptId}">${code}document.getElementById("${randomScriptId}").remove();</script>`;
}

function generateRandomId(prefix?: string) {
  return `${prefix || ''}_${(Math.random() * 1000000).toFixed()}`;
}

/**
 * Somtimes it is not safe to write into writeable
 * For example, it can be inline style attr right now in a chunk
 * So, we have to wait until any tag will be in the beggining of the chunk
 *
 * Looks like it is a bug inside React
 * @TODO check after react 18.2.0 release
 */
function isItSafeToWrite(chunk: any) {
  const stringifiedChunk = chunk.toString();

  return stringifiedChunk[0] === '<';
}
