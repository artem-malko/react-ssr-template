import { memo, useCallback, useRef, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Page } from 'core/store/types';
import { useStyles } from 'infrastructure/css/hook';
import { Link } from 'ui/kit/link';
import { Popover } from 'ui/kit/popover';
import { usePopup } from 'ui/kit/popup/infrastructure/hook';
import { ProjectInfo } from '../projectInfo';
import { styles } from './index.css';
import { BasePopup } from 'ui/kit/popup/basePopup';

const pagesPopupId = 'pages';

export const DevMenu = memo(() => {
  const css = useStyles(styles);
  const { addPopup } = usePopup();
  const [isShown, setIsShown] = useState(false);
  const popoverParentRef = useRef(null);
  const hide = useCallback(() => {
    setIsShown(false);
  }, []);
  const [isQueryDevToolsUsed, setIsQueryDevToolsUsed] = useState(false);

  return (
    <>
      <div className={css('root')}>
        <div
          className={css('link')}
          onClick={() => {
            addPopup({
              id: pagesPopupId,
              body: (
                <BasePopup popupId={pagesPopupId}>
                  <PagesPopup />
                </BasePopup>
              ),
            });
          }}
        >
          Show page list
        </div>
        <div
          className={css('link')}
          onClick={() => {
            addPopup({
              id: 'scenario',
              body: (
                <BasePopup popupId="scenario">
                  <ScenarioPopup />
                </BasePopup>
              ),
              options: {
                closeOnOverlayClick: true,
                closeOnEscape: true,
                minHeight: '300px',
                minWidth: '300px',
              },
            });
          }}
        >
          Start popup scenario
        </div>
        <div className={css('link')}>
          <div ref={popoverParentRef} onClick={() => setIsShown(true)}>
            Show project info
          </div>
          <Popover
            hide={hide}
            targetEl={popoverParentRef.current}
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

const PagesPopup = memo(() => {
  const { closePopupById: hidePopupById } = usePopup();
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
          <li key={link.title} onClick={() => hidePopupById(pagesPopupId)}>
            {link.page.name} — <Link page={link.page}>URL is {link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

const ScenarioPopup = memo(() => {
  const { addPopup } = usePopup();

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
      <button
        onClick={() => {
          addPopup({
            id: 'modal',
            body: (
              <BasePopup popupId="modal" hideCloseButton>
                <ModalPopup popupId="modal" />
              </BasePopup>
            ),
            options: {
              minHeight: '250px',
              minWidth: '250px',
            },
          });
        }}
      >
        Open model popup
      </button>
    </div>
  );
});

const ModalPopup = memo<{ popupId: string }>(({ popupId }) => {
  const { closePopupById, closeAllPopups } = usePopup();

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
      <button
        onClick={() => {
          closePopupById(popupId);
        }}
      >
        Close modal popup
      </button>
      <br />
      Or you can close all popups
      <br />
      <br />
      <button onClick={() => closeAllPopups()}>Close all popups</button>
    </div>
  );
});
