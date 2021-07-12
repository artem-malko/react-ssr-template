import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { getInitialDataFromDom } from 'ui/components/initialData';

export const usePaginatedNews = (page = 1) => {
  // @TODO_AFTER_REACT_18_RELEASE remove as any
  // https://github.com/reactjs/rfcs/pull/32
  const queryId = (React as any).unstable_useOpaqueIdentifier();

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
      initialData: () => {
        return getInitialDataFromDom(queryId);
      },
      // keepPreviousData: true,
    },
  );

  return news;
};
