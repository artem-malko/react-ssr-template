import { createPrefixer } from 'inline-style-prefixer';

const generateData = require('inline-style-prefixer/lib/generator');
const plugins = require('inline-style-prefixer/lib/plugins');

// npx browserslist "last 1 version, >1%"
const browserList = {
  and_chr: 70,
  and_ff: 63,
  and_qq: 1.2,
  and_uc: 11.8,
  android: 67,
  baidu: 7.12,
  bb: 10,
  chrome: 58,
  edge: 17,
  firefox: 63,
  ie: 11,
  ie_mob: 11,
  ios_saf: '11.3-11.4',
  op_mini: 'all',
  op_mob: 46,
  opera: 57,
  safari: 12,
  samsung: 7.2,
};

const prefixData = generateData.default(browserList);

export const prefix = createPrefixer({
  ...prefixData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  plugins: plugins.default.filter((pluginFunction: Function) => {
    return prefixData.plugins.includes(pluginFunction.name);
  }),
});
