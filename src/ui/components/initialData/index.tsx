import { memo, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

type Props = {
  queryId: string;
  queryOutput: UseQueryResult;
};

/**
 * InitialData is used to render any inital data, which were fetched in a server side
 * and that data needs on a client side on the initial client render.
 *
 * The biggest problem is — inital HTML from the server side will be different on the client side,
 * cause on the initial render InitialData will be rendered as an empty div.
 * When the data on the server side will be ready, React will send updates for InitalData component
 * But we will see an error, that the client render and the server render has a different output.
 * For example, if Redux was used in React 17, we can fetch all needed data,
 * insert it to the ready HTML-body. Then, on the client side we can use raw data
 * from the HTML-body as an Inital Data of a Redux store on the client side.
 * But we can not do it with React 18 and streaming API, cause the HTML-body will be sent by React asap.
 * So, no any inital data will be in the HTML-body.
 *
 * Idea is pretty simple: we will add the fetched data to an HTML-comment.
 * HTML-comments are not validated by React, so, we can send any content in any HTML-comment
 * from the server side, and that HTML-comment can have a new inner on the client side.
 *
 * Later, in a react-query (usePaginatedNews, for example) we can use data
 * from that HTML-comment as an initial data for that query.
 * And as soon, as InitialData  component will be rendered, we will remove the HTML-comment inner text, so
 * the query will be use its own cache, not the initial data from the server side.
 */
export const InitialData = memo<Props>(({ queryId, queryOutput }) => {
  const id = createDomIdForQuery(queryId);

  useEffect(() => {
    const mutableEl = document.getElementById(id);

    if (mutableEl) {
      mutableEl.innerHTML = '';
    }
  }, [id]);

  return process.env.APP_ENV === 'server' ? (
    <div
      hidden
      id={id}
      dangerouslySetInnerHTML={{
        __html: `<!--${queryOutput.isSuccess && JSON.stringify(queryOutput.data)}-->`,
      }}
    />
  ) : (
    <div hidden id={id} />
  );
});

export const getInitialDataFromDom = (queryId: string) => {
  if (process.env.APP_ENV === 'server') {
    return;
  }

  // @TODO add a comment Node type checking like in React 18 server restore
  const rawData = document.getElementById(createDomIdForQuery(queryId))?.childNodes[0]?.textContent;

  // @TODO catch any parse errors
  return rawData ? JSON.parse(rawData) : undefined;
};

const createDomIdForQuery = (queryId: string) => {
  return `query_id-${queryId}`;
};
