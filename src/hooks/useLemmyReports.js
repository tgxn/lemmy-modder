import { useEffect, useMemo } from "react";

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

import { getSiteData } from "../hooks/getSiteData";

import { useSelector } from "react-redux";

import useLemmyInfinite from "./useLemmyInfinite";
import {
  selectFilterCommunity,
  selectFilterType,
  selectOrderBy,
  selectShowRemoved,
  selectShowResolved,
} from "../redux/reducer/configReducer";

// gets paginated / infinite list of reports from lemmy
export default function useLemmyReports() {
  const orderBy = useSelector(selectOrderBy);
  const filterType = useSelector(selectFilterType);
  const filterCommunity = useSelector(selectFilterCommunity);
  const showResolved = useSelector(selectShowResolved);
  // const showRemoved = useSelector(selectShowRemoved);

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
  } = useLemmyInfinite({
    callLemmyMethod: "listPostReports",
    formData: {
      unresolved_only: showResolved !== true,
    },
    countResultElement: "post_reports",
  });

  const {
    isLoading: commentReportsLoading,
    isFetching: commentReportsFetching,
    isFetchingNextPage: commentReportsFetchingNextPage,
    hasNextPage: commentReportsHasNextPage,
    fetchNextPage: commentReportsFetchNextPage,
    refetch: commentReportsRefetch,
    error: commentReportsError,
    data: commentReportsData,
  } = useLemmyInfinite({
    callLemmyMethod: "listCommentReports",
    formData: {
      unresolved_only: showResolved !== true,
    },
    countResultElement: "comment_reports",
  });

  const {
    isLoading: pmReportsLoading,
    isFetching: pmReportsFetching,
    isFetchingNextPage: pmReportsFetchingNextPage,
    hasNextPage: pmReportsHasNextPage,
    fetchNextPage: pmReportsFetchNextPage,
    refetch: pmReportsRefetch,
    error: pmReportsError,
    data: pmReportsData,
  } = useLemmyInfinite({
    callLemmyMethod: "listPrivateMessageReports",
    formData: {
      unresolved_only: showResolved !== true,
    },
    countResultElement: "private_message_reports",
    enabled: userRole === "admin",
  });

  function mapPagesData(startList, mapFunction) {
    let reportsList = [];
    for (let i = 0; i < startList.length; i++) {
      const pageEntries = startList[i].data.map(mapFunction);
      reportsList = reportsList.concat(pageEntries);
    }
    return reportsList;
  }

  const mergedReports = useMemo(() => {
    console.log("mergedReports", postReportsData, commentReportsData, pmReportsData);

    // must have post and comment report data
    if (!postReportsData || !commentReportsData || !(pmReportsData || userRole != "admin")) return;

    // return if either of these are still loading
    if (postReportsLoading || commentReportsLoading || (pmReportsLoading && userRole === "admin")) return;

    console.log("mergedReports", postReportsData, commentReportsData, pmReportsData);

    if (!pmReportsData) {
      console.log("pmReportsError - may not be site admin", pmReportsError);
      // pmReportsData.private_message_reports = [];
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
    // if (!showRemoved) {
    //   mergedReports = mergedReports.filter((report) => {
    //     return !report.removed;
    //   });
    // }

    mergedReports.sort((a, b) => {
      // check for values that are null
      if (!a.time) return 1;
      if (!b.time) return -1;

      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    console.log("mergedReports", mergedReports);
    return mergedReports;
  }, [
    commentReportsData,
    postReportsData,
    pmReportsData,
    postReportsLoading,
    commentReportsLoading,
    pmReportsLoading,
    filterType,
    filterCommunity,
    showResolved,
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
