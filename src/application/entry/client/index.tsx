import { Main } from 'application/entry/react';
import { routes } from 'application/pages/shared';
import { ApplicationConfig } from 'application/shared/config/types';
import { CompileAppURLContext } from 'application/shared/kit/link/context';
import { PopupControllerContext } from 'application/shared/kit/popup/infrastructure/context';
import { PopupController } from 'application/shared/kit/popup/infrastructure/controller';
import { ToastControllerContext } from 'application/shared/kit/toast/infrastructure/context';
import { ToastController } from 'application/shared/kit/toast/infrastructure/controller';
import { RequesterContext } from 'application/shared/lib/request';
import { startClientApplication, getClientApplicationConfig } from 'framework/public/client';
import { createRequest, createAppLogger, createURLCompiler } from 'framework/public/universal';

const toastController = new ToastController();
const popupController = new PopupController();
const config = getClientApplicationConfig<ApplicationConfig>();

const request = createRequest({
  networkTimeout: config.networkTimeout,
});
const appLogger = createAppLogger({
  networkTimeout: config.networkTimeout,
});

const compileAppURL = createURLCompiler(routes);

startClientApplication({
  MainComp: (
    <CompileAppURLContext.Provider value={compileAppURL}>
      <RequesterContext.Provider value={request}>
        <ToastControllerContext.Provider value={toastController}>
          <PopupControllerContext.Provider value={popupController}>
            <Main />
          </PopupControllerContext.Provider>
        </ToastControllerContext.Provider>
      </RequesterContext.Provider>
    </CompileAppURLContext.Provider>
  ),
  compileAppURL,
  appLogger,
  onRecoverableError(args) {
    appLogger.sendErrorLog({
      id: 'onRecoverableError',
      message: (!!args && args.toString()) || 'onRecoverableError',
      source: 'unknown',
    });
  },
});
