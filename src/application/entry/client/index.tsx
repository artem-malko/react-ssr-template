import { Main } from 'application/entry/react';
import { compileAppURL } from 'application/pages/shared';
import { ApplicationConfig } from 'application/shared/config/types';
import { PopupControllerContext } from 'application/shared/kit/popup/infrastructure/context';
import { PopupController } from 'application/shared/kit/popup/infrastructure/controller';
import { ToastControllerContext } from 'application/shared/kit/toast/infrastructure/context';
import { ToastController } from 'application/shared/kit/toast/infrastructure/controller';
import { createServices } from 'application/shared/services';
import { ServiceContext } from 'application/shared/services/shared/context';
import { startClientApplication, getClientApplicationConfig } from 'framework/public/client';
import { createRequest, createAppLogger } from 'framework/public/universal';

const toastController = new ToastController();
const popupController = new PopupController();
const config = getClientApplicationConfig<ApplicationConfig>();

const request = createRequest({
  networkTimeout: config.networkTimeout,
});
const appLogger = createAppLogger({
  networkTimeout: config.networkTimeout,
});
const services = createServices({
  request,
  config: {
    hackerNewsApiUrl: config.hackerNewsApiUrl,
    fakeCrudApi: config.fakeCrudApi,
  },
  appLogger,
});

startClientApplication({
  MainComp: (
    <ServiceContext.Provider value={services}>
      <ToastControllerContext.Provider value={toastController}>
        <PopupControllerContext.Provider value={popupController}>
          <Main />
        </PopupControllerContext.Provider>
      </ToastControllerContext.Provider>
    </ServiceContext.Provider>
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
