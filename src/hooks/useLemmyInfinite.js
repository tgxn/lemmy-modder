import { useEffect, useMemo } from "react";

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

import { getSiteData } from "../hooks/getSiteData";

import { useSelector } from "react-redux";

import { LemmyHttp } from "lemmy-js-client";

export default function useLemmyInfinite({
  callLemmyMethod,
  formData,
  countResultElement,
  enabled = true,
  perPage = 25,
}) {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);
  // const showResolved = useSelector((state) => state.configReducer.showResolved);

  const formDataArray = useMemo(() => {
    const formDataArray = [];
    for (const [key, value] of Object.entries(formData)) {
      formDataArray.push(key);
      formDataArray.push(value);
    }
    return formDataArray;
  }, [formData]);

  const { localPerson } = getSiteData();

  const {
    isSuccess,
    isLoading,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isError,
    error,
    data,
    isFetching,
    isRefetching,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["lemmyHttp", localPerson.id, formDataArray, callLemmyMethod],
    queryFn: async ({ pageParam = 1, ...rest }, optional) => {
      console.log("LemmyHttp inner infinite", callLemmyMethod, pageParam, rest, optional);

      const lemmyClient = new LemmyHttp(`https://${currentUser.base}`);

      const siteData = await lemmyClient[callLemmyMethod]({
        auth: currentUser.jwt,
        page: pageParam,
        limit: perPage,
        ...formData,
      });

      const result = countResultElement ? siteData[countResultElement] : siteData;

      return {
        data: result,
        nextPage: result.length > 0 && result.length == perPage ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage, allPages) => lastPage.nextPage,
    keepPreviousData: true,

    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!currentUser && enabled,
  });

  return {
    isSuccess,
    isLoading,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isError,
    error,
    data,
    isFetching,
    isRefetching,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
  };
}
