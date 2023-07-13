import { useEffect, useMemo } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";

import { useSelector } from "react-redux";

import { LemmyHttp } from "lemmy-js-client";
import { getSiteData } from "../hooks/getSiteData";

import { useLemmyHttp } from "./useLemmyHttp";

export function useLemmyReports() {
  const orderBy = useSelector((state) => state.configReducer.orderBy);
  const filterType = useSelector((state) => state.configReducer.filterType);
  const filterCommunity = useSelector((state) => state.configReducer.filterCommunity);
  const showResolved = useSelector((state) => state.configReducer.showResolved);
  const showRemoved = useSelector((state) => state.configReducer.showRemoved);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading: commentReportsLoading,
    isFetching: commentReportsFetching,
    error: commentReportsError,
    data: commentReportsData,
  } = useLemmyHttp("listCommentReports", {
    unresolved_only: true,
    page: 1,
    limit: 25,
  });

  const {
    isLoading: postReportsLoading,
    isFetching: postReportsFetching,
    error: postReportsError,
    data: postReportsData,
  } = useLemmyHttp("listPostReports", {
    unresolved_only: true,
    page: 1,
    limit: 25,
  });

  console.log("postReportsData", userRole === "admin");
  const {
    isLoading: pmReportsLoading,
    isFetching: pmReportsFetching,
    error: pmReportsError,
    data: pmReportsData,
  } = useLemmyHttp(
    "listPrivateMessageReports",
    {
      unresolved_only: true,
      page: 1,
      limit: 25,
    },
    userRole === "admin",
  );

  const mergedReports = useMemo(() => {
    if (commentReportsLoading || postReportsLoading || pmReportsLoading) return [];
    if (!commentReportsData || !postReportsData || !pmReportsData) return [];

    if (pmReportsError && pmReportsError.response.status === 400) {
      pmReportsData.private_message_reports = [];
    }

    let normalPostReports = postReportsData.post_reports.map((report) => {
      return {
        ...report,
        type: "post",
        time: report.post_report.published,
        resolved: report.post_report.resolved,
        deleted: report.post.deleted,
        removed: report.post.removed,
      };
    });
    console.log("normalPostReports", normalPostReports);

    let normalCommentReports = commentReportsData.comment_reports.map((report) => {
      return {
        ...report,
        type: "comment",
        time: report.comment_report.published,
        resolved: report.comment_report.resolved,
        deleted: report.comment.deleted,
        removed: report.comment.removed,
      };
    });
    console.log("normalCommentReports", normalCommentReports);

    let normalPMReports = pmReportsData.private_message_reports.map((report) => {
      return {
        ...report,
        type: "pm",
        time: report.private_message_report.published,
        resolved: report.private_message_report.resolved,
        deleted: report.private_message.deleted,
        removed: false,
      };
    });
    console.log("normalPMReports", normalPMReports);

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

    console.log("mergedReports", mergedReports);

    mergedReports.sort((a, b) => {
      // check for values that are null
      if (!a.post_report?.published) return 1;
      if (!b.post_report?.published) return -1;

      return new Date(b.post_report.published).getTime() - new Date(a.post_report.published).getTime();
    });

    // console.log("mergedReports", mergedReports);
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

  const isLoading = commentReportsLoading || postReportsLoading || pmReportsLoading;
  const isFetching = commentReportsFetching || postReportsFetching || pmReportsFetching;

  const isError = commentReportsError || postReportsError;

  return {
    isLoading,
    isFetching,
    isError,

    reportsList: mergedReports,
  };
}
