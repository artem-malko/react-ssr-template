import { useErrorsInFakeAPI, useRandomLatencyInFakeAPI } from 'application/constants/cookies';
import { usePlatformAPI } from 'framework/platform/shared/context';
import { memo } from 'react';

export const FakeAPIConfigurator = memo(() => {
  const { cookies } = usePlatformAPI();
  const useErrorsInFakeAPIFromCookie = cookies.get(useErrorsInFakeAPI.name);
  const useRandomLatencyInFakeAPIFromCookie = cookies.get(useRandomLatencyInFakeAPI.name);

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <input
          id="errors"
          type="checkbox"
          defaultChecked={useErrorsInFakeAPIFromCookie === '1'}
          onChange={(event) => {
            if (event.target.checked) {
              cookies.set(useErrorsInFakeAPI.name, '1', useErrorsInFakeAPI.options);
              return;
            }

            cookies.delete(useErrorsInFakeAPI.name);
          }}
        />
        <label htmlFor="errors">Enable errors</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <input
          id="latency"
          type="checkbox"
          defaultChecked={useRandomLatencyInFakeAPIFromCookie === '1'}
          onChange={(event) => {
            if (event.target.checked) {
              cookies.set(useRandomLatencyInFakeAPI.name, '1', useRandomLatencyInFakeAPI.options);
              return;
            }

            cookies.delete(useRandomLatencyInFakeAPI.name);
          }}
        />
        <label htmlFor="latency">Enable latency</label>
      </div>
    </div>
  );
});
FakeAPIConfigurator.displayName = 'FakeAPIConfigurator';
