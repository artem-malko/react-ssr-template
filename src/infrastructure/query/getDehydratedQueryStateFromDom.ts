export const getDehydratedQueryStateFromDom = (queryId: string) => {
  if (process.env.APP_ENV === 'server') {
    return;
  }

  const isHydratedQueryKey = queryId + '_hydrated';

  if ((window as any)[isHydratedQueryKey]) {
    return;
  }

  /**
   * dehydratedQueryState is in the dom via DehydrateQueryWritable
   * For more info checkout queryDehydrator.ts
   */
  const dehydratedQueryState = (window as any)[queryId];

  /**
   * Needs to prevent useless hydration processes after the first hydration
   */
  if (dehydratedQueryState) {
    // eslint-disable-next-line functional/immutable-data
    (window as any)[isHydratedQueryKey] = true;
  }

  return dehydratedQueryState;
};
