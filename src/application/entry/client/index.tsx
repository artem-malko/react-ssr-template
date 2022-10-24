import { ApplicationConfig } from 'application/config/types';
import { compileAppURL } from 'application/main/routing';
import { createServices } from 'application/services';
import { ServiceContext } from 'application/services/shared/context';
import { PopupControllerContext } from 'application/ui/kit/popup/infrastructure/context';
import { PopupController } from 'application/ui/kit/popup/infrastructure/controller';
import { ToastControllerContext } from 'application/ui/kit/toast/infrastructure/context';
import { ToastController } from 'application/ui/kit/toast/infrastructure/controller';
import { Main } from 'application/ui/main';
import { startClientApplication } from 'framework/applications/client';
import { getClientApplicationConfig } from 'framework/config/generator/client';
import { createRequest } from 'framework/infrastructure/request';

const toastController = new ToastController();
const popupController = new PopupController();
const config = getClientApplicationConfig<ApplicationConfig>();

const requester = createRequest({
  networkTimeout: config.networkTimeout,
});
const services = createServices({
  requester,
  config: {
    hackerNewsApiUrl: config.hackerNewsApiUrl,
    fakeCrudApi: config.fakeCrudApi,
  },
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
});
