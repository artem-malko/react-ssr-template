import { GetMetadata, Metadata } from 'framework/public/server';
import { bindRouteConfigToPathCreator, createRouteConfigCreator } from 'framework/public/universal';

import { Page } from 'application/pages/shared';

import { ErrorPage } from '../error';

export const createRouteConfig = createRouteConfigCreator<Page, ErrorPage>();
export const bindRouteConfigToPath = bindRouteConfigToPathCreator<Page>();

export type GetMetadataForPage<P extends Page> = (
  ...params: Parameters<GetMetadata<P>>
) => Promise<Pick<Metadata, 'title' | 'description' | 'OG' | 'alternates'>>;
