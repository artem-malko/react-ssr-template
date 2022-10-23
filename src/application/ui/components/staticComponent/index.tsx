import { useConfig } from 'config/react';
import { SessionContext } from 'framework/session/context';
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { Alignment, Placement, Popover } from 'application/ui/kit/popover';

export const StaticComponent = memo(() => {
  const config = useConfig();
  const [isShown, setIsShown] = useState(false);
  const [alignment, setAlignment] = useState<Alignment>('center');
  const [placement, setPlacement] = useState<Placement>('start');
  const rootRef = useRef(null);
  const hide = useCallback(() => {
    setIsShown(false);
  }, []);
  const toggle = useCallback(() => {
    setIsShown((cur) => {
      return !cur;
    });
  }, []);

  const onAlignmentChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setAlignment(event.target.value as Alignment);
      toggle();
    },
    [toggle],
  );
  const onPlacementChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setPlacement(event.target.value as Placement);
      toggle();
    },
    [toggle],
  );
  const session = useContext(SessionContext);

  return (
    <div
      style={{
        padding: 10,
        outline: '1px solid green',
      }}
    >
      <h2>StaticComponent Component</h2>
      This is an example static component without any data fetching.
      <h4>A config usage example</h4>
      This is a field from the config hackerNewsApiUrl: {config.hackerNewsApiUrl}
      <br />
      <br />
      <h4>Session content</h4>
      <div>{session.userAgent}</div>
      <br />
      <br />
      <h2>An example of useOutsideClick</h2>
      <p>Try to change options in select-boxes:</p>
      <div style={{ display: 'flex', marginTop: '25px' }}>
        <div style={{ marginRight: '100px' }}>
          <h3>placement</h3>
          <br />
          <select onChange={onPlacementChange} defaultValue="start">
            <option value="top">top</option>
            <option value="end">end</option>
            <option value="bottom">bottom</option>
            <option value="start">start</option>
          </select>
        </div>

        <div>
          <h3>alignment</h3>
          <br />
          <select onChange={onAlignmentChange} defaultValue="center">
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', margin: '100px 0', justifyContent: 'center' }}>
        <button onClick={toggle} ref={rootRef}>
          show/hide popover
        </button>
      </div>
      <Popover
        hide={hide}
        targetRef={rootRef}
        isShown={isShown}
        width={200}
        placement={placement}
        alignment={alignment}
      >
        <div style={{ background: '#fff', border: '1px solid red' }}>
          Dropdown content
          <br />
          Dropdown content
          <br />
          Dropdown content
          <br />
          Dropdown content
        </div>
      </Popover>
      <br />
      <br />
      <br />
    </div>
  );
});
