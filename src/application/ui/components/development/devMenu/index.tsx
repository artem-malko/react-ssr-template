import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { memo, useRef, useState } from 'react';


import { useUserByIdFetcher } from 'application/queries/users/useUserById';
import { Link } from 'application/ui/kit/link';
import { Popover } from 'application/ui/kit/popover';
import { BasePopup } from 'application/ui/kit/popup/basePopup';
import { usePopup, usePopupActions } from 'application/ui/kit/popup/infrastructure/hook';
import { useStyles } from 'framework/infrastructure/css/hook';

import { ProjectInfo } from '../projectInfo';
import { InvalidateQueryButton } from '../queryButtons/invalidateQueryButton';
import { RefetchQueryButton } from '../queryButtons/refetchQueryButton';
import { styles } from './index.css';

export const DevMenu = memo(() => {
  const css = useStyles(styles);
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
  const [isReactInfoShown, setIsReactInfoShown] = useState(false);
  const reactInfoPopoverParentRef = useRef(null);

  const [isQueryControlsPanelShown, setIsQueryControlsPanelShown] = useState(false);
  const queriesControlsPopoverParentRef = useRef(null);

  const [isQueryDevToolsUsed, setIsQueryDevToolsUsed] = useState(false);

  const fetchUserById = useUserByIdFetcher();
  const [userId, setUserId] = useState<string | undefined>();

  return (
    <>
      <div className={css('root')}>
        <div className={css('menu')}>
          <div className={css('link')}>
            <Link page={{ name: 'root' }} inlineStyles={{ color: '#fff' }}>
              Go to main
            </Link>
          </div>
          <div className={css('link')} onClick={showScenariosPopup}>
            Start popup scenario
          </div>
          <div className={css('link')}>
            <div ref={reactInfoPopoverParentRef} onClick={() => setIsReactInfoShown(true)}>
              Show project info
            </div>
            <Popover
              hide={() => setIsReactInfoShown(false)}
              targetRef={reactInfoPopoverParentRef}
              isShown={isReactInfoShown}
              width={200}
              alignment="center"
            >
              <ProjectInfo />
            </Popover>
          </div>
          <div className={css('link')}>
            <div
              ref={queriesControlsPopoverParentRef}
              onClick={() => setIsQueryControlsPanelShown(true)}
            >
              Show react query controls
            </div>
            <Popover
              hide={() => {
                setIsQueryControlsPanelShown(false);
              }}
              targetRef={queriesControlsPopoverParentRef}
              isShown={isQueryControlsPanelShown}
              width={450}
              alignment="center"
            >
              <div style={{ padding: 10, background: '#fff', border: '2px solid #212121' }}>
                {process.env.NODE_ENV !== 'production' && (
                  <div>
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
                <hr />
                <InvalidateQueryButton queryKey="news" key="invalidate_news" />
                <hr />
                <InvalidateQueryButton queryKey="users" key="invalidate_users" />
                <hr />
                <RefetchQueryButton queryKey="news" key="refetch_news" />
                <hr />
                <RefetchQueryButton queryKey="users" key="refetch_users" />
                <hr />
                <div style={{ padding: 10 }}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (userId) {
                        fetchUserById({ userId });
                      }
                    }}
                  >
                    User id:{' '}
                    <input
                      name="userId"
                      type="text"
                      onChange={(e) => setUserId(e.target.value)}
                      required
                    />
                    <br />
                    <br />
                    <button type="submit">fetch user</button>
                  </form>
                </div>
              </div>
            </Popover>
          </div>
        </div>
      </div>
      {isQueryDevToolsUsed && (
        <div style={{ position: 'fixed' }}>
          <ReactQueryDevtools initialIsOpen={false} panelProps={{ style: { height: 300 } }} />
        </div>
      )}
    </>
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
