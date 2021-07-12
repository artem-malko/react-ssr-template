import React, { memo, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

type Props = {
  // queryId: string;
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
 * So, idea is pretty simple: we'll add the fetched data to an HTML-comment.
 * HTML-comments are not validated by React, so, we can send any content in any HTML-comment
 * from the server side, and that HTML-comment can have a new inner on the client side.
 */
export const InitialData = memo<Props>(({ queryOutput }) => {
  // @TODO_AFTER_REACT_18_RELEASE remove as any
  const id = (React as any).unstable_useOpaqueIdentifier();

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

const createDomIdForQuery = (queryId: string) => {
  return `query_id-${queryId}`;
};

export const getInitialDataFromDom = (queryId: string) => {
  if (process.env.APP_ENV === 'server') {
    return;
  }

  // @TODO add a comment Node type checking like in React 18 server restore
  const rawData = document.getElementById(createDomIdForQuery(queryId))?.childNodes[0]?.textContent;

  // @TODO catch any parse errors
  return rawData ? JSON.parse(rawData) : undefined;
};
