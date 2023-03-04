import { GetTitle } from 'framework/public/universal';

import { UsersPage } from '.';
import { GetMetadataForPage } from '../_internals';

export const getTitle: GetTitle<UsersPage> = ({ page }) => {
  return `User page title. Page: ${page.params.page}, filters: ${page.params.filterStatus}`;
};

export const getMetaData: GetMetadataForPage<UsersPage> = async (params) => {
  return {
    title: getTitle(params),
    description: `Users page description: ${params.page.params}`,
  };
};
