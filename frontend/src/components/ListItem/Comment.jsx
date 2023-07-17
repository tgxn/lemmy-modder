import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import ForumIcon from "@mui/icons-material/Forum";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { SquareChip } from "../Display.jsx";

import {
  ResolveCommentReportButton,
  RemoveCommentButton,
  PurgeCommentButton,
} from "../Actions/CommentButtons.jsx";
import { BanUserCommunityButton, BanUserSiteButton } from "../Actions/GenButtons.jsx";

import { ReportListItem, PersonMetaLine, ReportDetails } from "./Common.jsx";

import { SanitizedLink } from "../Display.jsx";

export default function CommentListItem({ report }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PersonMetaLine creator={report.comment_creator} />

      {/* Comment Title */}
      <Typography variant="h4" component="h2">
        Comment:{" "}
        <SanitizedLink href={report.comment.ap_id} target="_blank" rel="noopener noreferrer">
          Show
        </SanitizedLink>
      </Typography>

      {/* Comment Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {report.comment.published && (
          <SquareChip color="neutral" variant="outlined" tooltip={report.comment.published}>
            <Moment fromNow>{report.comment.published}</Moment>
          </SquareChip>
        )}

        <SquareChip color={"primary"} tooltip="Child Comments" startDecorator={<ForumIcon />}>
          {report.counts.child_count}
        </SquareChip>

        <SquareChip color={"info"} tooltip="Score" startDecorator={<ThumbsUpDownIcon />}>
          {report.counts.score}
        </SquareChip>

        <SquareChip color={"info"} tooltip="Downvotes" startDecorator={<ThumbDownIcon />}>
          {report.counts.downvotes}
        </SquareChip>

        {report.comment_report.resolved && (
          <SquareChip
            color={"success"}
            variant="soft"
            tooltip={`Resolved by @${report.resolver.name}`}
            iconOnly={<DoneAllIcon fontSize="small" />}
          />
        )}

        {report.comment.removed && (
          <SquareChip color={"danger"} tooltip="Removed" iconOnly={<DeleteIcon fontSize="small" />} />
        )}

        {report.comment.deleted && (
          <SquareChip color={"danger"} tooltip="Deleted" iconOnly={<DeleteIcon fontSize="small" />} />
        )}
      </Typography>

      {/* Comment Content */}
      <Typography
        variant="body1"
        component="p"
        sx={{
          p: 1,
        }}
      >
        {report.comment.content}
      </Typography>

      <ReportDetails report={report.comment_report} creator={report.creator} />

      {/* Report Actions */}
      <Box
        sx={{
          // bottom right with flex
          pt: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {/* @ TODO SHOW FOR CREATOR? */}
          {/* <DeletePostButton report={report} /> */}
          <RemoveCommentButton report={report} />

          <BanUserCommunityButton person={report.comment_creator} community={report.community} />
          <BanUserSiteButton person={report.comment_creator} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <ResolveCommentReportButton report={report} />
        </Box>
      </Box>
    </Box>
  );
}
