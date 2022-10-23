/* eslint-disable functional/immutable-data */

import { Dependency, LoaderContext } from 'webpack';
import { storeInstance } from '../store';
import { isValidStyleObject } from '../../generator/utils';
import { STYLE_DESCRIPTOR } from '../shared';

// NodeJS Module
import NativeModule from 'module';

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

  Object.keys(require.cache).forEach((key) => {
    if (key.includes('src/ui')) {
      delete require.cache[key];
    }
  });

  const deps: string[] = [];

  module.children.forEach((c: any) => {
    deps.push(c.filename);
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

  // @TODO enable cache!
  this.cacheable(false);

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

    if (executedModuleResult.deps && executedModuleResult.deps.length) {
      executedModuleResult.deps.forEach((dep) => {
        // Process the first level imports to any .css file
        this.addDependency(dep);

        // Process its dependencies
        this.loadModule(dep, (err, _source, _sourceMap, module) => {
          if (err) {
            return;
          }

          module.dependencies.forEach((dep: Dependency & { request?: string }) => {
            if (dep.request) {
              this.resolve(this.context, dep.request, (err, res) => {
                if (err || !res) {
                  return;
                }

                this.addDependency(res);
              });
            }
          });
        });
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
  const hashMap: { [key: string]: any } = {};

  classNames.forEach((className) => {
    const hash = storeInstance.generateHash(className, styleDescriptor[className]);
    hashMap[className] = hash;
  });
  const result = `styles:${JSON.stringify(hashMap)}`;

  callback(null, `module.exports={${result}}`);
};

export default loader;
