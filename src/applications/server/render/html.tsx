import { clientApplicationConfig, serverApplicationConfig } from 'config/generator/server';
import { APPLICATION_CONFIG_VAR_NAME } from 'config/generator/shared';
import { App } from 'ui/main/app';
import { AssetsData } from '../utils/assets';
import { getFullPath } from './utils';

const publicPath = serverApplicationConfig.publicPath;

type Props = {
  assets: AssetsData;
  polyfillsSourceCode: string;
};
export function Html(props: Props) {
  const { assets, polyfillsSourceCode } = props;
  const inlineScript = `
    var ${APPLICATION_CONFIG_VAR_NAME} = ${JSON.stringify(clientApplicationConfig)};\
    ${props.assets.inlineContent}
  `;
  const reactPath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'react',
    resourceType: 'js',
    publicPath,
  });
  const appPath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'app',
    resourceType: 'js',
    publicPath,
  });

  return (
    <html lang="en" dir="ltr" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <div id="app">
          <App renderCallback={() => console.log('renderered')} />
        </div>
        <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
        <script dangerouslySetInnerHTML={{ __html: polyfillsSourceCode }} />
        <script src={reactPath} />
        <script src={appPath} />
      </body>
    </html>
  );
}
