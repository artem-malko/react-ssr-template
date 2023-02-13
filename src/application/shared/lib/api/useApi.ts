import { Api } from './types';
import { useApiContext } from './useApiContext';

/**
 * Creates a ready to use API-function
 *
 * @example
 *
 * // In an useQuery
 *
 * const useGetItem = () => {
 *   const getItem = useApi(getItemApi);
 *
 *   return useAppQuery(['items'], () => getItem());
 * }
 *
 * // Or in a mutation
 *
 * const useDeleteItem = () => {
 *   const deleteItem = useApi(deleteItemApi);
 *
 *   return useMutation((params: { id: string;  }) => deleteItem(params);
 * };
 *
 * // Or even in a component, if you need
 */
export const useApi = <Params, Result>(api: Api<Params, Result>) => {
  const ctx = useApiContext();

  return (params: Params) => api(params, ctx);
};
