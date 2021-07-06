import axios from 'axios';
import { useQuery } from 'react-query';
import { getInitialDataFromDom } from 'ui/components/initialData';

export const usePaginatedNews = (page = 1) => {
  // @TODO make it autogenerated
  // Try to use a react context, where queryId will be just an auto incremented number
  const queryId = 'news';

  const news = useQuery<
    Array<{
      title: string;
      id: string;
    }>
  >(
    ['news', page],
    async () => {
      // Simple fake latency for the requests from server side
      const timeout = process.env.APP_ENV === 'server' ? 3000 : 300;
      await new Promise((resolve) => setTimeout(resolve, timeout));

      return axios.get(`http://node-hnapi.herokuapp.com/news?page=${page}`).then((res) => {
        // @WIP just to reduce data to render
        return res.data.slice(0, 10);
      });
    },
    {
      staleTime: Infinity,
      initialData: () => {
        return getInitialDataFromDom(queryId);
      },
      // keepPreviousData: true,
    },
  );

  return {
    news,
    queryId,
  };
};
