/* eslint-disable functional/immutable-data */

import { Compiler, Compilation, sources, Chunk } from 'webpack';

import { generateCss } from '../../generator';
import { murmurhash2 } from '../../stringHash';
import { Style, Styles } from '../../types';
import { STYLE_DESCRIPTOR } from '../common';
import { storeInstance } from '../store';

const ConcatSource = sources.ConcatSource;

type Options = {
  useRTL: boolean;
  ltrChunkName: string;
  rtlChunkName: string;
};
export class CSSInJSPlugin {
  private options: Options = {
    useRTL: false,
    ltrChunkName: 'stylesLtr',
    rtlChunkName: 'stylesRtl',
  };

  constructor(options: Options) {
    this.options = options;
  }

  public apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation: Compilation) => {
      compilation.hooks.finishModules.tapAsync(this.constructor.name, (modules, callback) => {
        for (const module of modules) {
          const styleDescriptor: Styles<string> = module.buildInfo && module.buildInfo[STYLE_DESCRIPTOR];

          if (styleDescriptor) {
            Object.entries(styleDescriptor).forEach(([className, style]) => {
              storeInstance.addStyles(className, style);
            });
          }
        }

        callback();
      });

      compilation.hooks.additionalAssets.tapAsync(this.constructor.name, (callback) => {
        const styleDescriptors = storeInstance.getStyles();
        const styleDescriptorsWithSortedStyles = Object.keys(styleDescriptors)
          .sort()
          .reduce<Record<string, Style>>((mutableResult, styleDescriptorHash) => {
            const stylesDescriptor = styleDescriptors[styleDescriptorHash];

            if (!stylesDescriptor) {
              return mutableResult;
            }

            mutableResult[styleDescriptorHash] = stylesDescriptor;
            return mutableResult;
          }, {});
        const ltrStyles = generateCss(styleDescriptorsWithSortedStyles, 'ltr');

        this.createChunk({
          generatedCss: ltrStyles,
          isRTL: false,
          compilation,
        });

        if (this.options.useRTL) {
          const rtlStyles = generateCss(styleDescriptorsWithSortedStyles, 'rtl');

          this.createChunk({
            generatedCss: rtlStyles,
            isRTL: true,
            compilation,
          });
        }

        callback();
      });
    });
  }

  private createChunk(params: { generatedCss: string; isRTL: boolean; compilation: Compilation }) {
    const { generatedCss, isRTL, compilation } = params;
    const chunkName = isRTL ? this.options.rtlChunkName : this.options.ltrChunkName;
    const chunk = new Chunk(chunkName);
    const fileNameHashDigest = murmurhash2(generatedCss);
    const fileName = isRTL
      ? `styles.rtl.${fileNameHashDigest}.css`
      : `styles.ltr.${fileNameHashDigest}.css`;

    chunk.ids = [];
    chunk.files.add(fileName);

    // Add rendered CSS to compilation resources
    const source = new ConcatSource();
    source.add(generatedCss);

    compilation.emitAsset(fileName, source);
    compilation.chunks.add(chunk);
  }
}
