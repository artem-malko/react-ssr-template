import { memo, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

type Props = {
  queryId: string;
  queryOutput: UseQueryResult;
};
// @TODO add description to than flow
export const InitialData = memo<Props>(({ queryId, queryOutput }) => {
  const id = `query_id-${queryId}`;

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

  // @TODO add Node type checking like in React 18 server restore
  const rawData = document.getElementById(createDomIdForQuery(queryId))?.childNodes[0]?.textContent;

  // @TODO catch parse errors
  return rawData ? JSON.parse(rawData) : undefined;
};
