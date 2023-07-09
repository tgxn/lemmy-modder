import React from "react";

import { useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import Chip from "@mui/joy/Chip";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";

import SoapIcon from "@mui/icons-material/Soap";

import PostReportItem from "./ListItem/Post.jsx";
import CommentReportItem from "./ListItem/Comment.jsx";
import PMReportItem from "./ListItem/PM.jsx";

import CommunitySelect from "./CommunitySelect";

import { useLemmyHttp } from "../hooks/useLemmyHttp";

export default function ReportsList() {
  const selectedCommunity = useSelector((state) => state.configReducer.selectedCommunity);

  const [showResolved, setShowResolved] = React.useState(false);
  const [showDeleted, setShowDeleted] = React.useState(true);
  const [showReportType, setShowReportType] = React.useState("all");

  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

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

  const mergedReports = React.useMemo(() => {
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

    // filter type
    if (showReportType !== "all") {
      mergedReports = mergedReports.filter((report) => {
        if (showReportType === "posts") return report.type === "post";
        if (showReportType === "comments") return report.type === "comment";
        if (showReportType === "pms") return report.type === "pm";
      });
    }

    // filter to one community
    if (selectedCommunity !== "all") {
      mergedReports = mergedReports.filter((report) => {
        return report.community?.name === selectedCommunity;
      });
    }

    // filter out resolved reports
    if (!showResolved) {
      mergedReports = mergedReports.filter((report) => {
        return !report.resolved;
      });
    }

    // filter out deleted/removed posts
    if (!showDeleted) {
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

    console.log("mergedReports", mergedReports);
    return mergedReports;
  }, [
    commentReportsData,
    postReportsData,
    pmReportsData,
    selectedCommunity,
    showReportType,
    showResolved,
    showDeleted,
  ]);

  const isLoading = reportCountsLoading || commentReportsLoading || postReportsLoading || pmReportsLoading;
  const isFetching =
    reportCountsFetching || commentReportsFetching || postReportsFetching || pmReportsFetching;

  const isError = reportCountsError || commentReportsError || postReportsError || pmReportsError;

  const totalReports =
    reportCountsData?.post_reports +
    reportCountsData?.comment_reports +
    reportCountsData?.private_message_reports;

  if (isLoading || isFetching) {
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
        // pt: ,
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
        <CommunitySelect />

        <Select
          defaultValue={showReportType}
          color="neutral"
          variant="outlined"
          // size="sm"
          onChange={(e, newValue) => {
            setShowReportType(newValue);
          }}
          sx={{
            minWidth: 150,
          }}
        >
          <Option key={"post"} value={"all"} label={"All"} color="neutral">
            <Typography component="span">All</Typography>

            <Chip
              size="sm"
              variant="outlined"
              color={totalReports > 0 ? "warning" : "success"}
              sx={{
                ml: 1,
                borderRadius: 4,
                minHeight: "20px",
                paddingInline: "4px",
                fontSize: "xs",
              }}
            >
              {totalReports}
            </Chip>
          </Option>

          <Option key={"posts"} value={"posts"} label={"Posts"} color="neutral">
            <Typography component="span">Posts</Typography>

            <Chip
              size="sm"
              variant="outlined"
              color={reportCountsData?.post_reports > 0 ? "warning" : "success"}
              sx={{
                ml: "auto",
                borderRadius: 4,
                minHeight: "20px",
                paddingInline: "4px",
                fontSize: "xs",
              }}
            >
              {reportCountsData?.post_reports}
            </Chip>
          </Option>

          <Option key={"comments"} value={"comments"} label={"Comments"} color="neutral">
            <Typography component="span">Comments</Typography>

            <Chip
              size="sm"
              variant="outlined"
              color={reportCountsData?.comment_reports > 0 ? "warning" : "success"}
              sx={{
                ml: "auto",
                borderRadius: 4,
                minHeight: "20px",
                paddingInline: "4px",
                fontSize: "xs",
              }}
            >
              {reportCountsData?.comment_reports}
            </Chip>
          </Option>

          <Option key={"pms"} value={"pms"} label={"PMs"} color="neutral">
            <Typography component="span">PMs</Typography>

            <Chip
              size="sm"
              variant="outlined"
              color={reportCountsData?.private_message_reports > 0 ? "warning" : "success"}
              sx={{
                ml: "auto",
                borderRadius: 4,
                minHeight: "20px",
                paddingInline: "4px",
                fontSize: "xs",
              }}
            >
              {reportCountsData?.private_message_reports}
            </Chip>
          </Option>
        </Select>

        <Checkbox
          label="Show Resolved"
          variant="outlined"
          checked={showResolved}
          onChange={() => setShowResolved(!showResolved)}
        />

        <Checkbox
          label="Show Deleted"
          variant="outlined"
          checked={showDeleted}
          onChange={() => setShowDeleted(!showDeleted)}
        />
      </Sheet>

      {mergedReports.length == 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 2,
            mt: 4,
            borderRadius: 4,
            // border: "1px solid",
            // borderColor: "grey.500",
          }}
        >
          <SoapIcon sx={{ fontSize: 64 }} />
          <Box sx={{ fontWeight: "bold" }}>No reports found</Box>
        </Box>
      )}

      {mergedReports.length > 0 &&
        mergedReports.map((report, index) => {
          if (report.type === "comment") {
            return <CommentReportItem key={index} report={report} />;
          } else if (report.type === "post") {
            console.log("WERGFERGHERGERG", report);
            return <PostReportItem key={index} report={report} />;
          } else if (report.type === "pm") {
            return <PMReportItem key={index} report={report} />;
          }
        })}
    </Box>
  );
}
