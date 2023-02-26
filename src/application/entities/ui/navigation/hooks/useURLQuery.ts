import { useCommonURLQuery } from 'framework/public/universal';

import { UnwrapReadonlyArrayElement } from 'lib/types';

export const allowedURLQueryKeys = [
  'utm_media',
  'utm_source',
  'utm_campaign',
  'test_mode_attr',
] as const;
export type AllowedURLQueryKeys = UnwrapReadonlyArrayElement<typeof allowedURLQueryKeys>;

/**
 * Just a wrapper around useCommonURLQuery with a binded QueryKeys type
 */
export const useURLQuery = () => {
  return useCommonURLQuery<AllowedURLQueryKeys>();
};
