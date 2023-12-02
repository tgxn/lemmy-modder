import React from "react";

import Card from "@mui/joy/Card";

import Box from "@mui/joy/Box";
import Badge from "@mui/joy/Badge";
import Tooltip from "@mui/joy/Tooltip";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

import SoapIcon from "@mui/icons-material/Soap";

import PostReportItem from "./ListItem/Post.jsx";
import CommentReportItem from "./ListItem/Comment.jsx";
import PMReportItem from "./ListItem/PM.jsx";

function ReportListItem({ itemType, report, children }) {
  let itemColor;
  let itemIcon;
  let resolved = true;

  // const parsedActor = parseActorId(report.actor_id);

  if (itemType == "post") {
    resolved = report.post_report.resolved;
    itemColor = "primary";
    itemIcon = (
      <Tooltip
        title={`Post: ${report.community.actor_id.split("/")[2]}/c/${report.community.name}`}
        variant="outlined"
        placement="right"
        color="primary"
      >
        <StickyNote2Icon fontSize="md" />
      </Tooltip>
    );
  } else if (itemType == "comment") {
    resolved = report.comment_report.resolved;
    itemColor = "success";
    itemIcon = (
      <Tooltip
        title={`Comment: ${report.community.actor_id.split("/")[2]}/c/${report.community.name}`}
        variant="outlined"
        placement="right"
        color="success"
      >
        <ForumIcon fontSize="md" />
      </Tooltip>
    );
  } else if (itemType == "pm") {
    resolved = report.private_message_report.resolved;
    itemColor = "warning";
    itemIcon = (
      <Tooltip
        title={`PM: @${report.private_message_creator.name}`}
        variant="outlined"
        placement="right"
        color="warning"
      >
        <DraftsIcon fontSize="md" />
      </Tooltip>
    );
  }

  return (
    <Badge
      badgeContent={itemIcon}
      color={itemColor}
      size="lg"
      variant="outlined"
      badgeInset="5px 0 0 5px"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiBadge-badge": {
          height: "25px",
          zIndex: 950,
        },
      }}
    >
      <Card
        sx={{
          outline: resolved ? "1px solid #35ae716e" : null,
          display: "flex",
          flexDirection: "row",
          gap: 0,
          width: "100%",
          p: 2.5,
        }}
      >
        {/* {isFetching && (
          <Card
            color="neutral"
            sx={{
              width: "100%",
              // height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1000,
              bottom: 0,
              right: 0,
            }}
          >
            Loading...
          </Card>
        )} */}
        {children}
      </Card>
    </Badge>
  );
}

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
        <ReportListItem key={index} report={report} itemType="comment">
          <CommentReportItem report={report} />
        </ReportListItem>
      );
    } else if (report.type === "post") {
      return (
        <ReportListItem key={index} report={report} itemType="post">
          <PostReportItem report={report} />
        </ReportListItem>
      );
    } else if (report.type === "pm") {
      return (
        <ReportListItem key={index} report={report} itemType="pm">
          <PMReportItem report={report} />
        </ReportListItem>
      );
    }
  });
}
