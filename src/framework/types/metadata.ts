export type Metadata = {
  title: string;
  description: string;
  OG?: OG;
  alternates?: Alternates;
  themeColor?: ThemeColor[];
  viewport: Viewport;
  referrer?: Referrer;

  other?: Record<'meta' | 'link', Record<string, string>>;
};

export type ThemeColor = {
  color: string;
  // Example: (prefers-color-scheme: light)
  media?: string;
};

/**
 * Viewport meta structure
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag
 * intentionally leaving out user-scalable, use a string if you want that behavior
 */
export type Viewport = {
  width?: 'device-width' | number;
  height?: 'device-height' | number;
  initialScale?: string;
  minimumScale?: string;
  maximumScale?: string;
  userScalable?: 'yes' | 'no';
  interactiveWidget?: 'resizes-visual' | 'resizes-content' | 'overlays-content';
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 *
 * Does not include "unsafe-URL", cause this policy will leak
 * potentially-private information from HTTPS resource URLs to insecure origins.
 *
 * To use this users should use '"unsafe-URL" as Referrer'
 */
export type Referrer =
  | 'no-referrer'
  | 'origin'
  | 'no-referrer-when-downgrade'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin';

export type OGImage = string | OGImageDescriptor;
type OGImageDescriptor = {
  url: string;
  alt?: string;
} & (
  | {
      width?: never;
      height?: never;
    }
  | {
      width: number;
      height: number;
    }
);

export type OG = {
  title: string;
  description: string;
  url: string;
  siteName: string;
  images?: OGImage | Array<OGImage>;
  locale?: string;
  // @TODO add correct type
  type: string;
};

export type Alternates = {
  canonical?: string;
  self?: string;
  first?: string;
  next?: string;
  previous?: string;
  last?: string;
  languages?: {
    [lang: string]: string;
  };
};
