import { GetTitle } from 'framework/public/universal';

import { NewsPage } from '.';
import { GetMetadataForPage } from '../_internals';

export const getTitle: GetTitle<NewsPage> = ({ page }) => {
  return `News page title. Page: ${page.params.page}, useInfinity: ${page.params.useInfinity}`;
};

export const getMetaData: GetMetadataForPage<NewsPage> = async (params) => {
  return {
    title: getTitle(params),
    description: `News page description: ${params.page.params}`,
  };
};
