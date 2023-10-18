import React from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Alert from "@mui/joy/Alert";

import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

import { SquareChip } from "../Display.jsx";

import { ResolveCommentReportButton, RemoveCommentButton } from "../Actions/CommentButtons.jsx";
import { BanUserCommunityButton, BanUserSiteButton, PurgeUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";

import { MomentAdjustedTimeAgo, SanitizedLink, FediverseChipLink } from "../Display.jsx";

import { getSiteData } from "../../hooks/getSiteData";

const CommentContentDetail = ({ report }) => {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // we need to merge the `post.id` and the current instance's `base_url` to get the link
  const localPostLink = `https://${baseUrl}/comment/${report.comment.id}`;

  // link across instances
  // split ap_id
  const apId = report.comment.ap_id.split("/")[2];
  const fediversePostLink = report.comment.ap_id;

  return (
    <Box>
      {/* Comment Title */}
      <Typography variant="h4" component="h2">
        {/* <Typography>
          <ForumIcon fontSize="large" />
        </Typography> */}
        <SanitizedLink href={localPostLink} target="_blank" rel="noopener noreferrer">
          Open Comment in Context
        </SanitizedLink>
      </Typography>

      {/* Comment Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {baseUrl != apId && <FediverseChipLink href={fediversePostLink} />}

        {report.comment.published && (
          <SquareChip color="neutral" variant="outlined" tooltip={report.comment.published}>
            Created <MomentAdjustedTimeAgo fromNow>{report.comment.published}</MomentAdjustedTimeAgo>
          </SquareChip>
        )}

        <SquareChip color={"primary"} tooltip="Child Comments" startDecorator={<ForumIcon />}>
          {report.counts.child_count}
        </SquareChip>

        <SquareChip color={"primary"} tooltip="Score" startDecorator={<ThumbsUpDownIcon />}>
          {report.counts.score}
        </SquareChip>

        <SquareChip color={"primary"} tooltip="Downvotes" startDecorator={<ThumbDownIcon />}>
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
          <SquareChip color={"danger"} tooltip="Removed" iconOnly={<DeleteOutlineIcon fontSize="small" />} />
        )}

        {report.comment.deleted && (
          <SquareChip color={"danger"} tooltip="Deleted" iconOnly={<DeleteOutlineIcon fontSize="small" />} />
        )}
      </Typography>

      {/* Comment Content */}
      <Alert
        startDecorator={<FormatQuoteIcon />}
        variant="outlined"
        color="neutral"
        sx={{ mt: 1 }}
        // endDecorator={
        //   <React.Fragment>
        //     <Button variant="plain" color="danger" sx={{ mr: 1 }}>
        //       Undo
        //     </Button>
        //     <IconButton variant="soft" size="sm" color="danger">
        //       <CloseIcon />
        //     </IconButton>
        //   </React.Fragment>
        // }
      >
        {report.comment.content}
      </Alert>

      <PersonMetaLine
        creator={report.comment_creator}
        by
        sx={{
          px: 1,
        }}
      />
    </Box>
  );
};

export default function CommentListItem({ report }) {
  return (
    <Box
      sx={{
        // bottom right with flex
        pt: 0,
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        gap: 1,
        flexGrow: 1,
      }}
    >
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
          <PurgeUserSiteButton person={report.comment_creator} />
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
