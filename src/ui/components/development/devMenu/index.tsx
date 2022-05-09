import { memo, useCallback, useRef, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Page } from 'core/store/types';
import { useStyles } from 'infrastructure/css/hook';
import { Link } from 'ui/kit/link';
import { Popover } from 'ui/kit/popover';
import { usePopup, usePopupActions } from 'ui/kit/popup/infrastructure/hook';
import { ProjectInfo } from '../projectInfo';
import { styles } from './index.css';
import { BasePopup } from 'ui/kit/popup/basePopup';

export const DevMenu = memo(() => {
  const css = useStyles(styles);
  const { showPopup: showPagesPopup } = usePopup(
    () => ({
      body: ({ popupId, closePopup }) => (
        <BasePopup popupId={popupId}>
          <PagesPopup closePopup={closePopup} />
        </BasePopup>
      ),
      options: {
        closeOnOverlayClick: true,
        closeOnEscape: true,
      },
    }),
    [],
  );
  const { showPopup: showScenariosPopup } = usePopup(
    () => ({
      body: ({ popupId }) => (
        <BasePopup popupId={popupId}>
          <ScenarioPopup />
        </BasePopup>
      ),
      options: {
        closeOnOverlayClick: true,
        closeOnEscape: true,
        minHeight: '300px',
        minWidth: '300px',
      },
    }),
    [],
  );
  const [isShown, setIsShown] = useState(false);
  const popoverParentRef = useRef(null);
  const hide = useCallback(() => {
    setIsShown(false);
  }, []);
  const [isQueryDevToolsUsed, setIsQueryDevToolsUsed] = useState(false);

  return (
    <>
      <div className={css('root')}>
        <div className={css('link')} onClick={showPagesPopup}>
          Show page list
        </div>
        <div className={css('link')} onClick={showScenariosPopup}>
          Start popup scenario
        </div>
        <div className={css('link')}>
          <div ref={popoverParentRef} onClick={() => setIsShown(true)}>
            Show project info
          </div>
          <Popover
            hide={hide}
            targetRef={popoverParentRef}
            isShown={isShown}
            width={200}
            alignment="center"
          >
            <ProjectInfo />
          </Popover>
        </div>
        {process.env.NODE_ENV !== 'production' && (
          <div className={css('link')}>
            <input
              type="checkbox"
              id="qdt"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const targetInput = e.nativeEvent.target as HTMLInputElement;
                if (targetInput.checked) {
                  setIsQueryDevToolsUsed(true);
                } else {
                  setIsQueryDevToolsUsed(false);
                }
              }}
            />
            <label htmlFor="qdt">&nbsp;Enable React-Query devtools</label>
          </div>
        )}
      </div>
      {isQueryDevToolsUsed && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
});

const PagesPopup = memo<{ closePopup: () => void }>(({ closePopup }) => {
  const links: Array<{ page: Page; title: string }> = [
    {
      page: { name: 'root' },
      title: '/',
    },
    {
      page: {
        name: 'news',
        params: {
          page: 1,
        },
      },
      title: 'news?p=1',
    },
    {
      page: {
        name: 'users',
        params: {
          page: 1,
        },
      },
      title: 'users?p=1',
    },
    {
      page: {
        name: 'newsItem',
        params: {
          id: 29133561,
        },
      },
      title: 'news/29133561',
    },
  ];

  return (
    <div style={{ padding: 10, minWidth: 300, minHeight: 300, display: 'flex' }}>
      <ul>
        {links.map((link) => (
          <li key={link.title} onClick={closePopup} style={{ paddingBottom: 8 }}>
            {link.page.name} — <Link page={link.page}>URL is {link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

const ScenarioPopup = memo(() => {
  const { showPopup: showModalPopup } = usePopup(
    () => ({
      body: ({ popupId, closePopup }) => (
        <BasePopup popupId={popupId} hideCloseButton>
          <ModalPopup closePopup={closePopup} />
        </BasePopup>
      ),
      options: {
        minHeight: '250px',
        minWidth: '250px',
      },
    }),
    [],
  );

  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      You can close this popup by escape or clicking to the overlay
      <br />
      <br />
      <br />
      <button onClick={showModalPopup}>Open model popup</button>
    </div>
  );
});

const ModalPopup = memo<{ closePopup: () => void }>(({ closePopup }) => {
  const { closeAllPopups } = usePopupActions();

  return (
    <div
      style={{
        minWidth: '250px',
        minHeight: '250px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee',
        padding: 6,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      You can close it by clicking the button below:
      <br />
      <br />
      <button onClick={closePopup}>Close modal popup</button>
      <br />
      Or you can close all popups
      <br />
      <br />
      <button onClick={() => closeAllPopups()}>Close all popups</button>
    </div>
  );
});
