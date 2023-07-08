import { useState, useEffect } from "react";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";

// import { setUserJwt, setSelectedCommunity } from "../reducers/configReducer";

import { LemmyHttp } from "lemmy-js-client";

export function useLemmyHttp(callLemmyMethod, formData) {
  // const userJwt = useSelector((state) => state.configReducer.userJwt);
  // const instanceBase = useSelector((state) => state.configReducer.instanceBase);

  const currentUser = useSelector((state) => state.configReducer.currentUser);

  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } = useQuery({
    queryKey: ["lemmyHttp", callLemmyMethod], // single string key
    queryFn: async () => {
      const lemmyClient = new LemmyHttp(`https://${currentUser.base}`);
      // lemmyClient.jwt = userJwt;
      const siteData = await lemmyClient[callLemmyMethod]({
        auth: currentUser.jwt,
        ...formData,
      });
      return siteData;
    },
    retry: 1,
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
    isSuccess,
    isError,
    error,
    data,
  };
}

export function useLemmyHttpAction(callLemmyMethod) {
  const currentUser = useSelector((state) => state.configReducer.currentUser);

  // const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const lemmyClient = new LemmyHttp(`https://${currentUser.base}`);

      const resultData = await lemmyClient[callLemmyMethod]({
        auth: currentUser.jwt,
        ...formData,
      });

      return resultData;
    },
    // onSuccess: (data) => {
    //   console.log("useLemmyHttpAction", callLemmyMethod, "onSuccess", data);
    //   // queryClient.setQueryData(["todo", { id: 5 }], resultData);

    // },
  });

  const callAction = (formData) => {
    mutation.mutate(formData);
  };

  console.log("useLemmyHttpAction", mutation.error);

  return {
    callAction,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
