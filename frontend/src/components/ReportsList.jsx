import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";

import SoapIcon from "@mui/icons-material/Soap";

import { useInView } from "react-intersection-observer";

import { useSelector } from "react-redux";

import PostReportItem from "./ListItem/Post.jsx";
import CommentReportItem from "./ListItem/Comment.jsx";
import PMReportItem from "./ListItem/PM.jsx";

import { FilterCommunity, FilterTypeSelect, FilterResolved, FilterRemoved } from "./Filters";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import { useLemmyReports } from "../hooks/useLemmyReports";

import { ReportListItem } from "./ListItem/Common.jsx";

function RenderReports({ reportsList }) {
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

export default function ReportsList() {
  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const {
    isLoading: loadingReports,
    isFetching: isFetchingReports,
    isError: isReportsError,
    hasNextPage: hasNextPageReports,
    fetchNextPage: loadNextPageReports,
    fetchingNextPage: fetchingNextPageReports,
    reportsList,
  } = useLemmyReports();

  const isLoading = reportCountsLoading || loadingReports;
  const isError = reportCountsError || isReportsError;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          p: 2,
          mt: 8,
          borderRadius: 4,
          // border: "1px solid",
          // borderColor: "grey.500",
        }}
      >
        <CircularProgress size="lg" color="info" />
        <Box sx={{ fontWeight: "bold" }}>Loading...</Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          p: 2,
          mt: 8,
          borderRadius: 4,
        }}
      >
        <Box sx={{ fontWeight: "bold" }}>Error!</Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Sheet
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 8,
          p: 1,
          gap: 2,
          mb: 0,
        }}
      >
        <FilterCommunity />

        <FilterTypeSelect />

        <FilterResolved />

        <FilterRemoved />
      </Sheet>

      <RenderReports reportsList={reportsList} />

      {hasNextPageReports && (
        <Box
          ref={ref}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            ref={ref}
            variant="outlined"
            onClick={() => loadNextPageReports()}
            loading={fetchingNextPageReports}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}
