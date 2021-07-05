import axios from 'axios';
import { useQuery } from 'react-query';

export const usePaginatedNews = (page = 1) => {
  const info = useQuery(
    ['news', page],
    async () => {
      // Simple fake latency for the requests from server side
      const timeout = process.env.APP_ENV === 'server' ? 5000 : 500;
      await new Promise((resolve) => setTimeout(resolve, timeout));

      return axios
        .get<
          Array<{
            title: string;
            id: string;
          }>
        >(`http://node-hnapi.herokuapp.com/news?page=${page}`)
        .then((res) => res.data);
    },
    {
      staleTime: Infinity,
      keepPreviousData: true,
    },
  );

  return info;
};
