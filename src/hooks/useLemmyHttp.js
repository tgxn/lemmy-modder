import { useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiteData } from "../hooks/getSiteData";

import LemmyHttpMixed from "../lib/LemmyHttpMixed";
// import { LemmyHttp } from "lemmy-js-client";

import {
  selectCurrentUser,
  updateCurrentUserData,
  setAccountIsLoading,
} from "../redux/reducer/accountReducer";

export function useLemmyHttp(callLemmyMethod, formData = {}) {
  const currentUser = useSelector(selectCurrentUser);

  const formDataArray = useMemo(() => {
    const formDataArray = [];
    for (const [key, value] of Object.entries(formData)) {
      formDataArray.push(key);
      formDataArray.push(value);
    }
    return formDataArray;
  }, [formData]);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } = useQuery({
    queryKey: ["lemmyHttp", localPerson.id, callLemmyMethod, formDataArray],
    queryFn: async () => {
      const lemmyClient = new LemmyHttpMixed(`https://${currentUser.base}`);
      await lemmyClient.setupAuth(currentUser.jwt);
      const siteData = await lemmyClient.call(callLemmyMethod, formData);

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
      const lemmyClientAuthed = new LemmyHttpMixed(`https://${currentUser.base}`);
      await lemmyClientAuthed.setupAuth(currentUser.jwt);
      // const getSite = await lemmyClientAuthed.call("getSite");

      // const lemmyClient = new LemmyHttp(`https://${currentUser.base}`, {
      //   headers: {
      //     Authorization: `Bearer ${currentUser.jwt}`,
      //   },
      // });

      const resultData = await lemmyClientAuthed.call(callLemmyMethod, {
        // auth: currentUser.jwt,
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
      dispatch(setAccountIsLoading(true));

      const lemmyClientAuthed = new LemmyHttpMixed(`https://${currentUser.base}`);
      await lemmyClientAuthed.setupAuth(currentUser.jwt);
      const getSite = await lemmyClientAuthed.call("getSite");

      // const lemmyClient = new LemmyHttp(`https://${currentUser.base}`, {
      //   headers: {
      //     Authorization: `Bearer ${currentUser.jwt}`,
      //   },
      // });

      // const getSite = await lemmyClient.getSite();

      dispatch(updateCurrentUserData(getSite));

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      dispatch(setAccountIsLoading(false));
    },
  });

  return mutation;
}
