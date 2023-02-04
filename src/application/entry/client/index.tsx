import { ApplicationConfig } from 'application/config/types';
import { compileAppURL } from 'application/main/routing';
import { createServices } from 'application/services';
import { ServiceContext } from 'application/services/shared/context';
import { PopupControllerContext } from 'application/ui/kit/popup/infrastructure/context';
import { PopupController } from 'application/ui/kit/popup/infrastructure/controller';
import { ToastControllerContext } from 'application/ui/kit/toast/infrastructure/context';
import { ToastController } from 'application/ui/kit/toast/infrastructure/controller';
import { Main } from 'application/ui/main';
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
