/* eslint-disable functional/immutable-data */

import NativeModule from 'module';

import { LoaderContext } from 'webpack';

import { isValidStyleObject } from '../../generator/utils';
import { STYLE_DESCRIPTOR } from '../shared';
import { storeInstance } from '../store';

// NodeJS Module

// Replacement for loader.exec
// https://github.com/webpack/webpack.js.org/issues/1268#issuecomment-313513988
const exec = <T>(
  loaderContext: LoaderContext<T>,
  code: string,
  filename: string,
  // paths from resolve section in webpack config
  additionalResolvePaths: string[],
) => {
  const module = new (NativeModule as any)(filename, loaderContext);
  module.paths = (NativeModule as any)
    ._nodeModulePaths(loaderContext.context)
    .concat(additionalResolvePaths);
  module.filename = filename;

  module._compile(code, filename);

  const deps: string[] = [];

  module.children.forEach((c: { filename: string }) => {
    if (!c.filename.endsWith('css.ts')) {
      return;
    }

    deps.push(c.filename);

    if (require.cache[c.filename]) {
      delete require.cache[c.filename];
    }
  });

  return {
    exports: module.exports,
    deps,
  };
};

interface LoaderParams {
  resolveModules: string[];
}

const optionsScheme = {
  title: 'CSS-in-JS Loader options',
  additionalProperties: false,
  type: 'object' as const,
  properties: {
    resolveModules: {
      type: 'array' as const,
    },
  },
};

/**
 * Default values for every param that can be passed in the loader query.
 */
const DEFAULT_QUERY_VALUES: LoaderParams = {
  resolveModules: [],
};

const loader = function (this: LoaderContext<LoaderParams>, source: string) {
  const { resource } = this;
  const callback = this.async();

  /**
   * CSS.TS files allowed only!
   */
  if (!resource.includes('css.ts')) {
    callback(null, source);
    return;
  }

  // Parse the loader query and apply the default values in case no values are provided
  const loaderParams: LoaderParams = Object.assign(
    {},
    DEFAULT_QUERY_VALUES,
    this.getOptions(optionsScheme),
  );
  let executedModuleExports: any = {};

  // Execute module with styles
  try {
    const executedModuleResult = exec(this, source.toString(), resource, loaderParams.resolveModules);
    executedModuleExports = executedModuleResult.exports;

    /**
     * Any additional css-file, which is not imported in a component
     * has to be added as a dependency
     */
    if (executedModuleResult.deps && executedModuleResult.deps.length) {
      executedModuleResult.deps.forEach((dep) => {
        this.addDependency(dep);
      });
    }
  } catch (e) {
    return callback(e as Error);
  }

  const styleDescriptor = executedModuleExports['styles'];

  if (!styleDescriptor || !isValidStyleObject(styleDescriptor)) {
    callback(null, source.toString());
    return;
  }

  this._module!.buildInfo[STYLE_DESCRIPTOR] = styleDescriptor;
  const classNames = Object.keys(styleDescriptor);
  const hashMap: Record<string, string> = {};

  classNames.forEach((className) => {
    const hash = storeInstance.generateHash(className, styleDescriptor[className]);
    hashMap[className] = hash;
  });
  const result = `styles:${JSON.stringify(hashMap)}`;

  callback(null, `module.exports={${result}}`);
};

export default loader;
