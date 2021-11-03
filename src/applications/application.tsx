import { APPLICATION_CONFIG_VAR_NAME } from 'config/generator/shared';
import { ApplicationConfig } from 'config/types';
import { Session } from 'core/session/types';
import { AppState } from 'core/store/types';
import { getFullPathForStaticResource } from 'infrastructure/webpack/getFullPathForStaticResource';
import { memo } from 'react';
import { Store } from 'redux';
import { AssetsList } from './server/utils/assets';
import { Main } from 'ui/main';
import { popoverContainerId } from 'ui/kit/popover/shared';

export const Application = memo<{
  store: Store<AppState>;
  assets: {
    pathMapping: AssetsList;
    inlineContent: string;
  };
  polyfillsSourceCode: string;
  session: Session;
  publicPath: string;
  clientApplicationConfig: ApplicationConfig;
  onRender?: () => void;
}>(
  ({
    store,
    assets,
    polyfillsSourceCode,
    session,
    publicPath,
    clientApplicationConfig,
    onRender = () => {
      /** */
    },
  }) => {
    const inlineScript = `
      var ${APPLICATION_CONFIG_VAR_NAME} = ${JSON.stringify(clientApplicationConfig)};\
      var __initialReduxState = ${JSON.stringify(store.getState())
        // http://timelessrepo.com/json-isnt-a-javascript-subset
        .replace(/\u2028|\u2029/g, (c) => (c === '\u2028' ? '\\u2028' : '\\u2029'))
        // https://github.com/reduxjs/redux/blob/master/docs/recipes/ServerRendering.md#security-considerations
        .replace(/</g, '\\u003c')};\
      var __staticResourcesPathMapping = ${JSON.stringify(assets)};\
      var __session = ${JSON.stringify(session)};\
      var __polyfillsSourceCode = ${JSON.stringify({
        code: polyfillsSourceCode,
      })};\
      ${assets.inlineContent}
    `;
    const appPath = getFullPathForStaticResource({
      staticResourcesPathMapping: assets.pathMapping,
      chunkName: 'app',
      resourceType: 'js',
      publicPath,
    });
    const vendorPath = getFullPathForStaticResource({
      staticResourcesPathMapping: assets.pathMapping,
      chunkName: 'vendor',
      resourceType: 'js',
      publicPath,
    });
    const infrastructurePath = getFullPathForStaticResource({
      staticResourcesPathMapping: assets.pathMapping,
      chunkName: 'infrastructure',
      resourceType: 'js',
      publicPath,
    });
    const libPath = getFullPathForStaticResource({
      staticResourcesPathMapping: assets.pathMapping,
      chunkName: 'lib',
      resourceType: 'js',
      publicPath,
    });

    return (
      <>
        <Main renderCallback={onRender} />
        <div
          id={popoverContainerId}
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            width: '100vw',
            minHeight: '100%',
            top: 0,
            left: 0,
          }}
        />

        <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
        {!!polyfillsSourceCode && <script dangerouslySetInnerHTML={{ __html: polyfillsSourceCode }} />}
        <script src={appPath} async />
        <script src={infrastructurePath} async />
        <script src={libPath} async />
        <script src={vendorPath} async />
      </>
    );
  },
);
