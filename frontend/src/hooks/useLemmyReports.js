import { useEffect, useMemo } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";

import { useSelector } from "react-redux";

import { LemmyHttp } from "lemmy-js-client";

import { useLemmyHttp } from "./useLemmyHttp";

export function useLemmyReports() {
  const {
    isLoading: commentReportsLoading,
    isFetching: commentReportsFetching,
    error: commentReportsError,
    data: commentReportsData,
  } = useLemmyHttp("listCommentReports");

  const {
    isLoading: postReportsLoading,
    isFetching: postReportsFetching,
    error: postReportsError,
    data: postReportsData,
  } = useLemmyHttp("listPostReports");

  const {
    isLoading: pmReportsLoading,
    isFetching: pmReportsFetching,
    error: pmReportsError,
    data: pmReportsData,
  } = useLemmyHttp("listPrivateMessageReports");

  const mergedReports = useMemo(() => {
    if (!commentReportsData || !postReportsData || !pmReportsData) return [];

    let normalPostReports = postReportsData.post_reports.map((report) => {
      return {
        ...report,
        type: "post",
        time: report.post_report.published,
        resolved: report.post_report.resolved,
        deleted: report.post_report.deleted,
        removed: report.post_report.removed,
      };
    });

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

    let mergedReports = [...normalPostReports, ...normalCommentReports, ...normalPMReports];

    // console.log("mergedReports", mergedReports);
    return mergedReports;
  }, [commentReportsData, postReportsData, pmReportsData]);

  const isLoading = commentReportsLoading || postReportsLoading || pmReportsLoading;
  const isFetching = commentReportsFetching || postReportsFetching || pmReportsFetching;

  const isError = commentReportsError || postReportsError || pmReportsError;

  return {
    isLoading,
    isFetching,
    isError,

    reportsList: mergedReports,
  };
}
