import React from "react";

import Box from "@mui/joy/Box";

import SoapIcon from "@mui/icons-material/Soap";

import PostReportItem from "./ListItem/Post.jsx";
import CommentReportItem from "./ListItem/Comment.jsx";
import PMReportItem from "./ListItem/PM.jsx";

import { ReportListItem } from "./ListItem/Common.jsx";

export default function ReportsList({ reportsList }) {
  if (!reportsList || reportsList.length == 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          p: 2,
          mt: 4,
          borderRadius: 4,
        }}
      >
        <SoapIcon sx={{ fontSize: 64 }} />
        <Box sx={{ fontWeight: "bold" }}>No reports found</Box>
      </Box>
    );
  }

  return reportsList.map((report, index) => {
    if (report.type === "comment") {
      return (
        <ReportListItem report={report} itemType="comment">
          <CommentReportItem key={index} report={report} />
        </ReportListItem>
      );
    } else if (report.type === "post") {
      return (
        <ReportListItem report={report} itemType="post">
          <PostReportItem key={index} report={report} />
        </ReportListItem>
      );
    } else if (report.type === "pm") {
      return (
        <ReportListItem report={report} itemType="pm">
          <PMReportItem key={index} report={report} />
        </ReportListItem>
      );
    }
  });
}
