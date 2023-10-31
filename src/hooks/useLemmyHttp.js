import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiteData } from "../hooks/getSiteData";

import { LemmyHttp } from "lemmy-js-client";

import { selectCurrentUser, updateCurrentUserData } from "../reducers/accountReducer";

export function useLemmyHttp(callLemmyMethod, formData) {
  const currentUser = useSelector(selectCurrentUser);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } = useQuery({
    queryKey: ["lemmyHttp", localPerson.id, callLemmyMethod],
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
  const currentUser = useSelector(selectCurrentUser);

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

  return {
    callAction,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}

export function refreshAllData() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const currentUser = useSelector(selectCurrentUser);

  const mutation = useMutation({
    mutationFn: async () => {
      const lemmyClient = new LemmyHttp(`https://${currentUser.base}`);

      const getSite = await lemmyClient.getSite({
        auth: currentUser.jwt,
      });

      dispatch(updateCurrentUserData(getSite));

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
    },
  });

  return mutation;
}
