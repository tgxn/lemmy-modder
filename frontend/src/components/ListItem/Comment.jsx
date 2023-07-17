import React from "react";

import Moment from "react-moment";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import ForumIcon from "@mui/icons-material/Forum";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { SquareChip } from "../Display.jsx";

import { ResolveCommentReportButton, RemoveCommentButton } from "../Actions/CommentButtons.jsx";
import { BanUserCommunityButton, BanUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";

import { SanitizedLink } from "../Display.jsx";

import { CommentContentDetail } from "./Content.jsx";

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

      <CommentContentDetail report={report} />

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
