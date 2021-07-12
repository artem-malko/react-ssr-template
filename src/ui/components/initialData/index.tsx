import React, { memo, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

type Props = {
  // queryId: string;
  queryOutput: UseQueryResult;
};
// @TODO add a description to that flow
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
