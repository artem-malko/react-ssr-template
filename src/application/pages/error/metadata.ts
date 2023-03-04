import { GetTitle } from 'framework/public/universal';

import { ErrorPage } from '.';
import { GetMetadataForPage } from '../_internals';

export const getTitle: GetTitle<ErrorPage> = ({ page }) => {
  return `Error page title. Error code: ${page.params.code}`;
};

export const getMetaData: GetMetadataForPage<ErrorPage> = async (params) => {
  return {
    title: getTitle(params),
    description: `Error page description: ${params.page.params.code}`,
  };
};
