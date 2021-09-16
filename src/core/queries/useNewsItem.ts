import axios from 'axios';
import { useQuery } from 'react-query';

export const useNewsItem = (
  newsItemId: number,
  initialData?: {
    title: string;
    id: string;
  },
) => {
  const queryId = 'newsItem';

  const newsItem = useQuery<{
    title: string;
    id: string;
  }>(
    ['newsItem', newsItemId],
    async () => {
      return axios.get(`http://node-hnapi.herokuapp.com/item/${newsItemId}`).then((res) => {
        return res.data;
      });
    },
    {
      staleTime: Infinity,
      initialData,
    },
  );

  return { newsItem, queryId };
};
