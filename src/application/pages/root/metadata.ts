import { GetTitle } from 'framework/public/universal';

import { RootPage } from '.';
import { GetMetadataForPage } from '../_internals';

export const getTitle: GetTitle<RootPage> = ({ URLQueryParams }) => {
  return `Root page title: ${URLQueryParams.toString()}`;
};

export const getMetaData: GetMetadataForPage<RootPage> = async (params) => {
  return {
    title: getTitle(params),
    description: `Root page description`,
  };
};
