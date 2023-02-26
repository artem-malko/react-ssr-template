import { startClientApplication, getClientApplicationConfig } from 'framework/public/client';
import { createRequest, createAppLogger, createURLCompiler } from 'framework/public/universal';

import { routes } from 'application/pages/shared';

import { CompileAppURLContext, allowedURLQueryKeys } from 'application/entities/ui/navigation';

import { ApplicationConfig } from 'application/shared/config/types';
import { PopupControllerContext, PopupController } from 'application/shared/kit/popup';
import { ToastControllerContext, ToastController } from 'application/shared/kit/toast';
import { RequesterContext } from 'application/shared/lib/request';

import { Main } from '../common/react';

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
  allowedURLQueryKeys,
});
