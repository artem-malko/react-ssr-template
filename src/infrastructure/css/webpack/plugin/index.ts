/* eslint-disable functional/immutable-data */

import { Compiler, Compilation, sources, Chunk } from 'webpack';
import { getHashDigest } from 'loader-utils';
import { storeInstance } from '../store';
import { generateCss } from '../../generator';
import { STYLE_DESCRIPTOR } from '../shared';
import { Style } from '../../types';

const ConcatSource = sources.ConcatSource;

// @TODO make rtl optional
export class CSSInJSPlugin {
  public apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation: Compilation) => {
      compilation.hooks.finishModules.tapAsync(this.constructor.name, (modules, callback) => {
        for (const module of modules) {
          const styleDescriptor: {
            [hash: string]: Style;
          } = module.buildInfo && module.buildInfo[STYLE_DESCRIPTOR];

          if (styleDescriptor) {
            Object.entries(styleDescriptor).forEach(([className, style]) => {
              storeInstance.addStyles(className, style);
            });
          }
        }

        callback();
      });

      compilation.hooks.additionalAssets.tapAsync(this.constructor.name, (callback) => {
        // @TODO add clever store cleaning for webpack
        const styleDescriptors = storeInstance.getStyles();
        const styleDescriptorsWithSortedStyles = Object.keys(styleDescriptors)
          .sort()
          .reduce<{ [key: string]: Style }>((mutableResult, styleDescriptorHash) => {
            const stylesDescriptor = styleDescriptors[styleDescriptorHash];

            if (!stylesDescriptor) {
              return mutableResult;
            }

            mutableResult[styleDescriptorHash] = stylesDescriptor;
            return mutableResult;
          }, {});
        const ltrStyles = generateCss(styleDescriptorsWithSortedStyles, 'ltr');
        const rtlStyles = generateCss(styleDescriptorsWithSortedStyles, 'rtl');

        const rtlChunk = new Chunk('stylesRtl');
        const ltrChunk = new Chunk('stylesLtr');

        const ltrFileNameHashDigest = getHashDigest(Buffer.from(ltrStyles, 'utf-8'), 'sha1', 'hex', 16);
        const ltrFileName = `styles.ltr.${ltrFileNameHashDigest}.css`;

        const rtlFileNameHashDigest = getHashDigest(Buffer.from(rtlStyles, 'utf-8'), 'sha1', 'hex', 16);
        const rtlFileName = `styles.rtl.${rtlFileNameHashDigest}.css`;

        ltrChunk.ids = [];
        rtlChunk.ids = [];
        ltrChunk.files.add(ltrFileName);
        rtlChunk.files.add(rtlFileName);

        // Add rendered CSS to compilation resources
        const ltrSource = new ConcatSource();
        ltrSource.add(ltrStyles);
        compilation.emitAsset(ltrFileName, ltrSource);
        compilation.chunks.add(ltrChunk);

        const rtlSource = new ConcatSource();
        rtlSource.add(rtlStyles);
        compilation.emitAsset(rtlFileName, rtlSource);
        compilation.chunks.add(rtlChunk);

        callback();
      });
    });
  }
}
