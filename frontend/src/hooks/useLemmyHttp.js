import { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";

// import { setUserJwt, setSelectedCommunity } from "../reducers/configReducer";

import { LemmyHttp } from "lemmy-js-client";

export default function useLemmyHttp(callLemmyMethod, formData) {
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
