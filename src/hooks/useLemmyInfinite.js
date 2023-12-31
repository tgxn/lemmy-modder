import { useEffect, useMemo } from "react";

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

import { getSiteData } from "../hooks/getSiteData";

import { useSelector } from "react-redux";

import LemmyHttpMixed from "../lib/LemmyHttpMixed";
// import { LemmyHttp } from "lemmy-js-client";
import { selectCurrentUser } from "../redux/reducer/accountReducer";

export default function useLemmyInfinite({
  callLemmyMethod,
  formData,
  countResultElement,
  hasNextPageFunction = null,
  enabled = true,
  perPage = 25,
}) {
  const currentUser = useSelector(selectCurrentUser);
  // const showResolved = useSelector(selectShowResolved);

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
    queryKey: ["lemmyHttp", localPerson.id, callLemmyMethod, formDataArray],
    queryFn: async ({ pageParam = 1, ...rest }, optional) => {
      console.log("LemmyHttp inner infinite", callLemmyMethod, pageParam, rest, optional);

      const lemmyClientAuthed = new LemmyHttpMixed(`https://${currentUser.base}`);
      await lemmyClientAuthed.setupAuth(currentUser.jwt);
      // const getSite = await lemmyClientAuthed.call("getSite");

      // const lemmyClient = new LemmyHttp(`https://${currentUser.base}`, {
      //   headers: {
      //     Authorization: `Bearer ${currentUser.jwt}`,
      //   },
      // });

      const apiResultData = await lemmyClientAuthed.call(callLemmyMethod, {
        // auth: currentUser.jwt,
        page: pageParam,
        limit: perPage,
        ...formData,
      });

      let result = apiResultData;
      let nextPage = undefined;

      // function returns true if there's another page
      if (hasNextPageFunction) {
        const hasNextPage = hasNextPageFunction(apiResultData, perPage);
        nextPage = hasNextPage ? pageParam + 1 : undefined;
      }

      // if `countResultElement` is set; we need to return that as the primary arry instead of the whole object
      else if (countResultElement) {
        result = apiResultData[countResultElement];
        // countResult = result.length;
        nextPage = result.length > 0 && result.length == perPage ? pageParam + 1 : undefined;
      }

      return {
        data: result,
        nextPage,
      };
    },
    getNextPageParam: (lastPage, allPages) => lastPage.nextPage,
    keepPreviousData: true,

    retry: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
