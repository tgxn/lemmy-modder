import { useEffect } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";

import { useSelector } from "react-redux";

import { LemmyHttp } from "lemmy-js-client";

export function useLemmyHttp(callLemmyMethod, formData) {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);

  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } = useQuery({
    queryKey: ["lemmyHttp", callLemmyMethod],
    queryFn: async () => {
      const lemmyClient = new LemmyHttp(`https://${currentUser.base}`);

      const siteData = await lemmyClient[callLemmyMethod]({
        auth: currentUser.jwt,
        ...formData,
      });

      return siteData;
    },
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!currentUser,
  });

  // trigger when we have jwt
  useEffect(() => {
    if (currentUser.jwt) {
      refetch();
    }
  }, [currentUser]);

  return {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    data,
  };
}

export function useLemmyHttpAction(callLemmyMethod) {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const lemmyClient = new LemmyHttp(`https://${currentUser.base}`);

      const resultData = await lemmyClient[callLemmyMethod]({
        auth: currentUser.jwt,
        ...formData,
      });

      return resultData;
    },
  });

  const callAction = (formData) => {
    mutation.mutate(formData);
  };

  // console.log("useLemmyHttpAction", mutation.error);

  return {
    callAction,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
