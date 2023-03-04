import { applicationContainerId } from 'framework/constants/application';
import { Alternates, Metadata, OGImage, ThemeColor, Viewport } from 'framework/types/metadata';

import { keysOf } from 'lib/lodash';

type Params = {
  metadata: Metadata;
  dependencyScript: string;
};
/**
 * Generates main shell like html>head+body before react starts to stream
 * to allow adding styles and scripts to the existed dom
 */
export const generateShell = ({ metadata, dependencyScript }: Params) => {
  return `<!DOCTYPE html><html lang="en" dir="ltr" style="height:100%"><head><meta charset="utf-8" />${renderMetadata(
    metadata,
  )}<style>html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0;min-height:100vh;min-height:-webkit-fill-available;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif;;min-width:360px;width:100%}h1,h2,h3,h4{margin:0}@supports(-webkit-touch-callout:none){body{height:-webkit-fill-available}}body,button,html,input{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,hr,input{overflow:visible}button,select{text-transform:none}[type=button],[type=submit],button{-webkit-appearance:button}fieldset{border:none;margin:0;padding:0}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[hidden],template{display:none}</style></head><body style="position:relative">${dependencyScript}<div id="${applicationContainerId}">`;
};

const renderMetadata = (metadata: Metadata) => {
  const mutableResult: string[] = [];

  mutableResult.push(`<title>${metadata.title}</title>`);
  mutableResult.push(renderMetaTag('description', metadata.description));
  mutableResult.push(renderViewport(metadata.viewport));

  if (metadata.OG) {
    mutableResult.push(renderMetaTag('og:title', metadata.OG.title));
    mutableResult.push(renderMetaTag('og:description', metadata.OG.description));
    mutableResult.push(renderMetaTag('og:url', metadata.OG.url));
    mutableResult.push(renderMetaTag('og:site_name', metadata.OG.siteName));
    mutableResult.push(renderMetaTag('og:type', metadata.OG.type));

    if (metadata.OG.images) {
      if (Array.isArray(metadata.OG.images)) {
        metadata.OG.images.forEach((img) => {
          mutableResult.push(renderOGImageMeta(img));
        });
      } else {
        mutableResult.push(renderOGImageMeta(metadata.OG.images));
      }
    }

    if (metadata.OG.locale) {
      mutableResult.push(renderMetaTag('og:title', metadata.OG.locale));
    }
  }

  if (metadata.themeColor) {
    metadata.themeColor.forEach((themeColor) => {
      mutableResult.push(renderThemeColor(themeColor));
    });
  }

  if (metadata.referrer) {
    mutableResult.push(renderMetaTag('referrer', metadata.referrer));
  }

  if (metadata.alternates) {
    mutableResult.push(...renderAlternates(metadata.alternates));
  }

  if (metadata.other) {
    const otherMeta = metadata.other.meta;

    keysOf(otherMeta).forEach((key) => {
      const value = otherMeta![key];
      if (value) {
        mutableResult.push(renderMetaTag(key, value));
      }
    });

    const otherLinks = metadata.other.link;

    keysOf(otherLinks).forEach((key) => {
      const value = otherLinks![key];
      if (value) {
        mutableResult.push(renderLink(key, value));
      }
    });
  }

  return mutableResult.join('');
};

const renderMetaTag = (key: string, value: string | number) => {
  return `<meta name="${key}" content="${value}" />`;
};

const renderOGImageMeta = (OGImage: OGImage) => {
  if (typeof OGImage === 'string') {
    return renderMetaTag('og:image:url', OGImage);
  }

  const mutableResult: string[] = [];

  mutableResult.push(renderMetaTag('og:image:url', OGImage.url));

  if (OGImage.alt) {
    mutableResult.push(renderMetaTag('og:image:alt', OGImage.alt));
  }

  if (OGImage.height && OGImage.width) {
    mutableResult.push(renderMetaTag('og:image:height', OGImage.height));
    mutableResult.push(renderMetaTag('og:image:width', OGImage.width));
  }

  return mutableResult.join('');
};

const renderThemeColor = (themeColor: ThemeColor) => {
  if (themeColor.media) {
    return `<meta name="theme-color" media="${themeColor.media}" content="${themeColor.color}" />`;
  }

  return `<meta name="theme-color" content="${themeColor.color}" />`;
};

const renderAlternates = (alternates: Alternates) => {
  const mutableResult: string[] = [];

  keysOf(alternates).forEach((key) => {
    switch (key) {
      case 'languages': {
        const alternatesLanguages = alternates.languages;
        if (alternatesLanguages) {
          const languages = Object.keys(alternatesLanguages);

          languages.forEach((lang) => {
            const link = alternatesLanguages[lang];

            if (link) {
              mutableResult.push(`<link rel="alternate" hreflang="${lang}" href="${link}" />`);
            }
          });
        }

        break;
      }
      default: {
        const alternatesValue = alternates[key];

        if (alternatesValue) {
          mutableResult.push(renderLink(key, alternatesValue));
        }
      }
    }
  });

  return mutableResult;
};

const renderLink = (type: string, value: string) => {
  return `<link rel="${type}" href="${value}" />`;
};

const renderViewport = (viewport?: Viewport) => {
  const viewportKeys = viewport && keysOf(viewport);

  if (!viewport || !viewportKeys?.length) {
    return `<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>`;
  }

  const content = viewportKeys
    .map((key) => {
      switch (key) {
        case 'initialScale':
          return `initial-scale=${viewport[key]}`;
        case 'maximumScale':
          return `maximum-scale=${viewport[key]}`;
        case 'minimumScale':
          return `minimum-scale=${viewport[key]}`;
        case 'userScalable':
          return `user-scalable=${viewport[key]}`;
        case 'interactiveWidget':
          return `interactive-widget=${viewport[key]}`;
        default:
          return `${key}=${viewport[key]}`;
      }
    })
    .join(',');

  return renderMetaTag('viewport', content);
};
