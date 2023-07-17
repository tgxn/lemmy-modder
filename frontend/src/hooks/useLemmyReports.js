import { useEffect, useMemo } from "react";

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { getSiteData } from "../hooks/getSiteData";

import { useSelector } from "react-redux";

import { LemmyHttp } from "lemmy-js-client";

function useLemmyInfinite(callLemmyMethod, formData, countResultElement, enabled = true) {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);
  const showResolved = useSelector((state) => state.configReducer.showResolved);

  const perPage = 25;

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
    queryKey: ["lemmyHttp", localPerson.id, showResolved, callLemmyMethod],
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

// gets paginated / infinite list of reports from lemmy
export function useLemmyReports() {
  const orderBy = useSelector((state) => state.configReducer.orderBy);
  const filterType = useSelector((state) => state.configReducer.filterType);
  const filterCommunity = useSelector((state) => state.configReducer.filterCommunity);
  const showResolved = useSelector((state) => state.configReducer.showResolved);
  const showRemoved = useSelector((state) => state.configReducer.showRemoved);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading: postReportsLoading,
    isFetching: postReportsFetching,
    isFetchingNextPage: postReportsFetchingNextPage,
    hasNextPage: postReportsHasNextPage,
    fetchNextPage: postReportsFetchNextPage,
    refetch: postReportsRefetch,
    error: postReportsError,
    data: postReportsData,
  } = useLemmyInfinite(
    "listPostReports",
    {
      unresolved_only: showResolved !== true,
    },
    "post_reports",
  );

  const {
    isLoading: commentReportsLoading,
    isFetching: commentReportsFetching,
    isFetchingNextPage: commentReportsFetchingNextPage,
    hasNextPage: commentReportsHasNextPage,
    fetchNextPage: commentReportsFetchNextPage,
    refetch: commentReportsRefetch,
    error: commentReportsError,
    data: commentReportsData,
  } = useLemmyInfinite(
    "listCommentReports",
    {
      unresolved_only: showResolved !== true,
    },
    "comment_reports",
  );

  const {
    isLoading: pmReportsLoading,
    isFetching: pmReportsFetching,
    isFetchingNextPage: pmReportsFetchingNextPage,
    hasNextPage: pmReportsHasNextPage,
    fetchNextPage: pmReportsFetchNextPage,
    refetch: pmReportsRefetch,
    error: pmReportsError,
    data: pmReportsData,
  } = useLemmyInfinite(
    "listPrivateMessageReports",
    {
      unresolved_only: showResolved !== true,
    },
    "private_message_reports",
    userRole === "admin",
  );

  function mapPagesData(startList, mapFunction) {
    let reportsList = [];
    for (let i = 0; i < startList.length; i++) {
      const pageEntries = startList[i].data.map(mapFunction);
      reportsList = reportsList.concat(pageEntries);
    }
    return reportsList;
  }

  const mergedReports = useMemo(() => {
    if (!postReportsData || !commentReportsData || !pmReportsData) return;
    if (postReportsLoading || commentReportsLoading || pmReportsLoading) return;

    if (pmReportsError && pmReportsError.response.status === 400) {
      console.log("pmReportsError - may not be site admin", pmReportsError);
      pmReportsData.private_message_reports = [];
    }

    let normalPostReports = mapPagesData(postReportsData.pages, (report) => {
      return {
        ...report,
        type: "post",
        time: report.post_report.published,
        resolved: report.post_report.resolved,
        deleted: report.post.deleted,
        removed: report.post.removed,
      };
    });
    console.log("normalPostReports", normalPostReports.length);

    let normalCommentReports = mapPagesData(commentReportsData.pages, (report) => {
      return {
        ...report,
        type: "comment",
        time: report.comment_report.published,
        resolved: report.comment_report.resolved,
        deleted: report.comment.deleted,
        removed: report.comment.removed,
      };
    });
    console.log("normalCommentReports", normalCommentReports.length);

    let normalPMReports = [];

    if (userRole === "admin") {
      normalPMReports = mapPagesData(pmReportsData.pages, (report) => {
        return {
          ...report,
          type: "pm",
          time: report.private_message_report.published,
          resolved: report.private_message_report.resolved,
          deleted: report.private_message.deleted,
          removed: false,
        };
      });
      console.log("normalPMReports", normalPMReports.length);
    }

    let mergedReports = [...normalPostReports, ...normalCommentReports, ...normalPMReports];

    // filter type
    if (filterType !== "all") {
      mergedReports = mergedReports.filter((report) => {
        if (filterType === "posts") return report.type === "post";
        if (filterType === "comments") return report.type === "comment";
        if (filterType === "pms") return report.type === "pm";
      });
    }

    // filter to one community
    if (filterCommunity !== "all") {
      mergedReports = mergedReports.filter((report) => {
        return report.community?.name === filterCommunity;
      });
    }

    // filter out resolved reports
    if (!showResolved) {
      mergedReports = mergedReports.filter((report) => {
        return !report.resolved;
      });
    }

    // filter out deleted/removed posts
    if (!showRemoved) {
      mergedReports = mergedReports.filter((report) => {
        return !report.removed;
      });
    }

    mergedReports.sort((a, b) => {
      // check for values that are null
      if (!a.post_report?.published) return 1;
      if (!b.post_report?.published) return -1;

      return new Date(b.post_report.published).getTime() - new Date(a.post_report.published).getTime();
    });

    console.log("mergedReports", mergedReports);
    return mergedReports;
  }, [
    commentReportsData,
    postReportsData,
    pmReportsData,
    filterType,
    filterCommunity,
    showResolved,
    showRemoved,
  ]);

  const isLoading = commentReportsLoading || postReportsLoading || (pmReportsLoading && userRole === "admin");
  const isFetching = commentReportsFetching || postReportsFetching || pmReportsFetching;

  const isError = commentReportsError || postReportsError;

  const hasNextPage = commentReportsHasNextPage || postReportsHasNextPage || pmReportsHasNextPage;

  const fetchingNextPage =
    commentReportsFetchingNextPage || postReportsFetchingNextPage || pmReportsFetchingNextPage;

  const fetchNextPage = function () {
    if (postReportsHasNextPage) {
      postReportsFetchNextPage();
    }
    if (commentReportsHasNextPage) {
      commentReportsFetchNextPage();
    }
    if (pmReportsHasNextPage) {
      pmReportsFetchNextPage();
    }
  };

  return {
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
    fetchingNextPage,
    reportsList: mergedReports,
  };
}
