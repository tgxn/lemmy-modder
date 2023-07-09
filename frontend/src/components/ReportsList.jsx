import React from "react";

import { useDispatch, useSelector } from "react-redux";

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

import { setConfigItem } from "../reducers/configReducer";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import { useLemmyReports } from "../hooks/useLemmyReports";

export default function ReportsList() {
  const dispatch = useDispatch();

  const orderBy = useSelector((state) => state.configReducer.orderBy);
  const filterType = useSelector((state) => state.configReducer.filterType);
  const showResolved = useSelector((state) => state.configReducer.showResolved);
  const showRemoved = useSelector((state) => state.configReducer.showRemoved);

  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  const { isLoading, isError, reportsList } = useLemmyReports();

  const totalReports =
    reportCountsData?.post_reports +
    reportCountsData?.comment_reports +
    reportCountsData?.private_message_reports;

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
        <CommunitySelect />

        <Select
          defaultValue={filterType}
          color="neutral"
          variant="outlined"
          // size="sm"
          onChange={(e, newValue) => {
            dispatch(setConfigItem("filterType", newValue));
          }}
          sx={{
            minWidth: 150,
          }}
        >
          <Option key={"post"} value={"all"} label={"All"} color="neutral">
            <Typography component="span">All</Typography>
          </Option>

          <Option key={"posts"} value={"posts"} label={"Posts"} color="neutral">
            <Typography component="span">Posts</Typography>
          </Option>

          <Option key={"comments"} value={"comments"} label={"Comments"} color="neutral">
            <Typography component="span">Comments</Typography>
          </Option>

          <Option key={"pms"} value={"pms"} label={"PMs"} color="neutral">
            <Typography component="span">PMs</Typography>
          </Option>
        </Select>

        <Checkbox
          label="Show Resolved"
          variant="outlined"
          checked={showResolved}
          onChange={() => {
            dispatch(setConfigItem("showResolved", !showResolved));
          }}
        />

        <Checkbox
          label="Show Deleted"
          variant="outlined"
          checked={showRemoved}
          onChange={() => {
            dispatch(setConfigItem("showRemoved", !showRemoved));
          }}
        />
      </Sheet>

      {reportsList.length == 0 && (
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
      )}

      {reportsList.length > 0 &&
        reportsList.map((report, index) => {
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
