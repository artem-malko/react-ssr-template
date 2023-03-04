import { GetTitle } from 'framework/public/universal';

import { getNewsItemDataFromCache } from 'application/entities/domain/news';

import { NewsItemPage } from '.';
import { GetMetadataForPage } from '../_internals';

export const getTitle: GetTitle<NewsItemPage> = ({ page }) => {
  return `NewsItem page title. Id: ${page.params.id}`;
};

export const getMetaData: GetMetadataForPage<NewsItemPage> = async (params) => {
  const newsItemData = getNewsItemDataFromCache({
    queryClient: params.queryClient,
    newsItemId: params.page.params.id,
  });

  return {
    title: getTitle(params),
    description: newsItemData
      ? 'NEWSITEM with name: ' + newsItemData.title
      : 'Example description for NewsItem page',
  };
};
