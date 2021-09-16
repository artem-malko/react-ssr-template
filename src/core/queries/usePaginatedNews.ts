import axios from 'axios';
import { useQuery } from 'react-query';
import { getInitialDataFromDom } from 'ui/components/initialData';

export const usePaginatedNews = (page = 1) => {
  const queryId = 'paginatedNews';

  const news = useQuery<
    Array<{
      title: string;
      id: string;
    }>
  >(
    ['news', page],
    async () => {
      // Simple fake latency for the requests from server side
      const timeout = process.env.APP_ENV === 'server' ? 4000 : 400;
      await new Promise((resolve) => setTimeout(resolve, timeout));

      return axios.get(`http://node-hnapi.herokuapp.com/news?page=${page}`).then((res) => {
        // @WIP just to reduce data to render
        return res.data.slice(0, 10);
      });
    },
    {
      staleTime: Infinity,
      initialData: () => getInitialDataFromDom(queryId),
    },
  );

  return { news, queryId };
};
