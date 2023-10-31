import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// metrics/sh.itjust.works.meta
export default function useLVQueryCache(queryKey, dataFile) {
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["lemmyVerseCache", dataFile], // single string key
    queryFn: () =>
      axios
        .get(`https://data.lemmyverse.net/data/${dataFile}.json`, {
          timeout: 15000,
        })
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
}
