import { compileAppURL } from 'application/main/routing';
import { createServices } from 'application/services';
import { ServiceContext } from 'application/services/shared/context';
import { PopupControllerContext } from 'application/ui/kit/popup/infrastructure/context';
import { PopupController } from 'application/ui/kit/popup/infrastructure/controller';
import { ToastControllerContext } from 'application/ui/kit/toast/infrastructure/context';
import { ToastController } from 'application/ui/kit/toast/infrastructure/controller';
import { Main } from 'application/ui/main';
import { getClientApplicationConfig } from 'config/generator/client';
import { startClientApplication } from 'framework/applications/client';
import { createRequest } from 'framework/infrastructure/request';

const toastController = new ToastController();
const popupController = new PopupController();
const config = getClientApplicationConfig();

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
  Comp: (
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
