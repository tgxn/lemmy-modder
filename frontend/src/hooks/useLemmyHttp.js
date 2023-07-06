import { useQuery } from "@tanstack/react-query";

import { LemmyHttp } from "lemmy-js-client";

export default function useLemmyHttp(callLemmyMethod, formData) {
  // local store jwt token
  const [userJwt, setUserJwt] = React.useReducer((state, action) => {
    if (action === null) {
      localStorage.removeItem("userJwt");
      return null;
    }

    localStorage.setItem("userJwt", action);
    return action;
  }, localStorage.getItem("userJwt"));

  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["lemmyHttp", callLemmyMethod], // single string key
    queryFn: async () => {
      const lemmyClient = new LemmyHttp(`https://lemmy.tgxn.net`);
      // lemmyClient.jwt = userJwt;
      const siteData = await lemmyClient[callLemmyMethod]({
        auth: userJwt,
        ...formData,
      });
      return siteData;
    },

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
