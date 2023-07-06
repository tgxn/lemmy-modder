import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";

import { LemmyHttp } from "lemmy-js-client";

import { PostReportItem, CommentReportItem, PMReportItem } from "./ReportListItem";

import useLemmyHttp from "../hooks/useLemmyHttp";

export default function ReportsList() {
  const selectedCommunity = useSelector((state) => state.configReducer.selectedCommunity);

  const {
    data: commentReportsData,
    loading: commentReportsLoading,
    error: commentReportsError,
  } = useLemmyHttp("listCommentReports");

  const {
    data: postReportsData,
    loading: postReportsLoading,
    error: postReportsError,
  } = useLemmyHttp("listPostReports");

  const {
    data: pmReportsData,
    loading: pmReportsLoading,
    error: pmReportsError,
  } = useLemmyHttp("listPrivateMessageReports");

  const mergedReports = React.useMemo(() => {
    if (!commentReportsData || !postReportsData || !pmReportsData) return [];

    function addTypeToAll(array, type) {
      return array.map((item) => {
        item.type = type;
        return item;
      });
    }

    let mergedReports = [
      ...addTypeToAll(postReportsData.post_reports, "post"),
      ...addTypeToAll(commentReportsData.comment_reports, "comment"),
      ...addTypeToAll(pmReportsData.private_message_reports, "pm"),
    ];

    // filter to one community
    if (selectedCommunity !== "all") {
      mergedReports = mergedReports.filter((report) => {
        return report.community.name === selectedCommunity;
      });
    }

    console.log("mergedReports", mergedReports);

    mergedReports.sort((a, b) => {
      // check for values that are null
      if (!a.post_report?.published) return 1;
      if (!b.post_report?.published) return -1;

      return new Date(b.post_report.published).getTime() - new Date(a.post_report.published).getTime();
    });

    console.log("mergedReports", mergedReports);
    return mergedReports;
  }, [commentReportsData, postReportsData, pmReportsData, selectedCommunity]);

  return (
    <Box
      sx={{
        pt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {mergedReports.length > 0 &&
        mergedReports.map((report, index) => {
          console.log("WERGFERGHERGERG", report);
          if (report.type === "comment") {
            return <CommentReportItem key={index} report={report} />;
          } else if (report.type === "post") {
            return <PostReportItem key={index} report={report} />;
          } else if (report.type === "pm") {
            return <PMReportItem key={index} report={report} />;
          }
        })}
    </Box>
  );
}
