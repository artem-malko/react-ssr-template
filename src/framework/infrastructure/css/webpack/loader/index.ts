/* eslint-disable functional/immutable-data */

import NativeModule from 'module';
import { join as joinPaths } from 'path';

import { LoaderContext } from 'webpack';

import { isValidStyleObject } from '../../generator/utils';
import { STYLE_DESCRIPTOR } from '../common';
import { storeInstance } from '../store';

// NodeJS Module
function isPathMatchesAlias(path: string, alias: string) {
  // Matching /^alias(\/|$)/
  if (path.indexOf(alias) === 0) {
    if (path.length === alias.length) return true;
    if (path[alias.length] === '/') return true;
  }

  return false;
}

// Replacement for loader.exec
// https://github.com/webpack/webpack.js.org/issues/1268#issuecomment-313513988
const execNodeJSModule = <T>(
  loaderContext: LoaderContext<T>,
  code: string,
  filename: string,
  // paths from resolve section in webpack config
  resolvePaths: string[],
  aliases: Record<string, string>,
) => {
  const moduleAliasNames = Object.keys(aliases);
  const module = new (NativeModule as any)(filename, loaderContext);

  // Add all possible resolve paths
  module.paths = (NativeModule as any)._nodeModulePaths(loaderContext.context).concat(resolvePaths);
  module.filename = filename;

  // Memo the native _resolveFilename function, to restore in later
  const oldResolveFilename = (NativeModule as any)._resolveFilename;

  /**
   * Replace original _resolveFilename with our custom function
   * to use aliases from webpack config
   */
  (NativeModule as any)._resolveFilename = function (
    request: string,
    parentModule: any,
    isMain: boolean,
    options: any,
  ) {
    for (let i = moduleAliasNames.length; i-- > 0; ) {
      const alias = moduleAliasNames[i];

      if (!!alias && isPathMatchesAlias(request, alias)) {
        const aliasTarget = aliases[alias];

        if (!aliasTarget) {
          break;
        }

        request = joinPaths(aliasTarget, request.substr(alias.length));
        // Only use the first match
        break;
      }
    }

    return oldResolveFilename.call(this, request, parentModule, isMain, options);
  };

  module._compile(code, filename);

  // Restore the original _resolveFilename function
  (NativeModule as any)._resolveFilename = oldResolveFilename;

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

  if (require.cache[filename]) {
    delete require.cache[filename];
  }

  return {
    exports: module.exports,
    deps,
  };
};

interface LoaderParams {
  resolveModules: string[];
  aliases: Record<string, string>;
}

const optionsScheme = {
  title: 'CSS-in-JS Loader options',
  additionalProperties: false,
  type: 'object' as const,
  properties: {
    resolveModules: {
      type: 'array' as const,
    },
    aliases: {
      type: 'object' as const,
    },
  },
};

/**
 * Default values for every param that can be passed in the loader query.
 */
const DEFAULT_QUERY_VALUES: LoaderParams = {
  resolveModules: [],
  aliases: {},
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
    const executedModuleResult = execNodeJSModule(
      this,
      source.toString(),
      resource,
      loaderParams.resolveModules,
      loaderParams.aliases,
    );
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
