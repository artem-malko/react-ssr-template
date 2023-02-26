import { memo, version } from 'react';

import { useActivePage, useURLQuery } from 'application/entities/ui/navigation';

import { SourceSpoiler } from '../sourceSpoiler';

export const ProjectInfo = memo(() => {
  const page = useActivePage();
  const { URLQueryParams } = useURLQuery();

  return (
    <div
      style={{ fontSize: 12, lineHeight: '16px', padding: 6, background: '#fff', border: '1px solid' }}
    >
      <div>
        React version is: <strong>{version}</strong>
      </div>
      <div>QueryString is: {JSON.stringify(URLQueryParams)}</div>
      <div>
        Current page: <strong>{page.name}</strong>. Click to «Show source» to get all data!
      </div>
      <div>
        <SourceSpoiler source={page} />
      </div>
    </div>
  );
});
