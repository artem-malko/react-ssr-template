import React, { Suspense, memo } from 'react';

import { APPLICATION_CONFIG_VAR_NAME } from 'framework/config/generator/shared';
import { BaseApplicationConfig } from 'framework/config/types';
import { AnyAppState } from 'framework/infrastructure/router/types';
import { Session } from 'framework/infrastructure/session/types';
import { getFullPathForStaticResource } from 'framework/infrastructure/webpack/getFullPathForStaticResource';

import { AssetsList } from './server/utils/assets';

export const Shell = memo<{
  state: AnyAppState;
  assets: {
    pathMapping: AssetsList;
    inlineContent: string;
  };
  session: Session;
  publicPath: string;
  clientApplicationConfig: BaseApplicationConfig;
  mainComp: React.ReactNode;
  onRender?: () => void;
}>(
  ({
    state,
    assets,
    session,
    publicPath,
    clientApplicationConfig,
    mainComp,
    onRender = () => {
      /** */
    },
  }) => {
    const inlineScript = `
      var ${APPLICATION_CONFIG_VAR_NAME} = ${JSON.stringify(clientApplicationConfig)};\
      var __initialRouterState = ${JSON.stringify(state)
        // http://timelessrepo.com/json-isnt-a-javascript-subset
        .replace(/\u2028|\u2029/g, (c) => (c === '\u2028' ? '\\u2028' : '\\u2029'))
        // https://github.com/reduxjs/redux/blob/master/docs/recipes/ServerRendering.md#security-considerations
        .replace(/</g, '\\u003c')};\
      var __staticResourcesPathMapping = ${JSON.stringify(assets)};\
      var __session = ${JSON.stringify(session)};\
      ${assets.inlineContent}
    `;
    const cssPath = getFullPathForStaticResource({
      staticResourcesPathMapping: assets.pathMapping,
      // @TODO handle RTL
      chunkName: 'stylesLtr',
      resourceType: 'css',
      publicPath,
    });

    return (
      <>
        {/* Use renderCallback as described here https://github.com/reactwg/react-18/discussions/5 */}
        <div ref={onRender}></div>
        <Suspense>{mainComp}</Suspense>

        {/* All needed script-files like React, vendors and so on
            will be added to a page via React (bootstrapScripts) */}
        <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
        {/* Insert a link to all stylesheets for searchbots and other users without JS */}
        <noscript>
          <link href={cssPath} rel="stylesheet" />
        </noscript>
      </>
    );
  },
);
