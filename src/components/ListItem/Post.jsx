import React from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Alert from "@mui/joy/Alert";
import Divider from "@mui/joy/Divider";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ForumIcon from "@mui/icons-material/Forum";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

import {
  SquareChip,
  MomentAdjustedTimeAgo,
  SanitizedLink,
  FediverseChipLink,
  UpvoteDownvoteChip,
} from "../Display.jsx";

import PostThumb from "../Content/PostThumb.jsx";

import { ResolvePostReportButton, RemovePostButton, PurgePostButton } from "../Actions/PostButtons.jsx";

import { BanUserCommunityButton, BanUserSiteButton, PurgeUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, CommunityMetaLine } from "../Shared/ActorMeta.jsx";
import { ReportDetails } from "../Shared/ReportDetails.jsx";

import { getSiteData } from "../../hooks/getSiteData";

const PostContentDetail = ({ report }) => {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // we need to merge the `post.id` and the current instance's `base_url` to get the link
  const localPostLink = `https://${baseUrl}/post/${report.post.id}`;

  // link across instances
  // split ap_id
  const apId = report.post.ap_id.split("/")[2];
  const fediversePostLink = report.post.ap_id;

  return (
    <Box>
      {/* Post Title */}
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: "17px",
        }}
      >
        {/* <Typography>
        <StickyNote2Icon fontSize="large" />
      </Typography> */}
        <SanitizedLink href={localPostLink} target="_blank" rel="noopener noreferrer">
          {report.post.name}
        </SanitizedLink>
      </Typography>

      {/* Post Meta */}
      <Typography variant="h6" component="h2" sx={{ mt: 0, display: "flex", gap: 1 }}>
        {baseUrl != apId && <FediverseChipLink href={fediversePostLink} />}

        {report.post.nsfw == true && (
          <SquareChip variant="outlined" color={"warning"}>
            NSFW
          </SquareChip>
        )}

        {/* // @TODO make options */}
        {/* {report.post.nsfw == false && (
            <SquareChip color="neutral" variant="outlined">
              SFW
            </SquareChip>
          )} */}

        {report.post.published && (
          <SquareChip color="neutral" variant="outlined" tooltip={report.post.published}>
            Created <MomentAdjustedTimeAgo fromNow>{report.post.published}</MomentAdjustedTimeAgo>
          </SquareChip>
        )}

        <SquareChip color={"primary"} tooltip="Comments" startDecorator={<ForumIcon />}>
          {report.counts.comments}
        </SquareChip>

        <UpvoteDownvoteChip counts={report.counts} />

        {/* 
        <SquareChip color="warning" tooltip="Downvotes" startDecorator={<ThumbDownIcon />}>
          {report.counts.downvotes}
        </SquareChip> */}

        {report.post_report.resolved && (
          <SquareChip
            color={"success"}
            variant="solid"
            tooltip={`Resolved by @${report.resolver.name}`}
            iconOnly={<DoneAllIcon fontSize="small" />}
          />
        )}

        {report.post.removed && (
          <SquareChip
            color={"danger"}
            variant="solid"
            tooltip="Removed"
            iconOnly={<BlockIcon fontSize="small" />}
          />
        )}

        {report.post.deleted && (
          <SquareChip
            color="danger"
            variant="solid"
            tooltip="Deleted"
            iconOnly={<DeleteOutlineIcon fontSize="small" />}
          />
        )}
      </Typography>

      <CommunityMetaLine
        community={report.community}
        showIn
        sx={{
          px: 1,
        }}
      />
      <PersonMetaLine
        creator={report.post_creator}
        by
        sx={{
          px: 1,
        }}
      />

      {/* Post Content */}
      {report.post.body && (
        <Alert startDecorator={<FormatQuoteIcon />} variant="outlined" color="neutral" sx={{ mt: 1, p: 1 }}>
          <Box sx={{ maxHeight: "150px", overflowX: "auto" }}>{report.post.body}</Box>
        </Alert>
      )}
    </Box>
  );
};

export default function PostListItem({ report }) {
  return (
    <React.Fragment>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <PostContentDetail report={report} />
          </Box>

          {/* Show External Link or Image for URLs */}
          {report.post.url && (
            <Box
              sx={{
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              <PostThumb post={report.post} report={report.post_report} />
            </Box>
          )}
        </Box>

        <ReportDetails report={report.post_report} creator={report.creator} />

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
            {/* <DeletePostButton report={report} /> */}
            <RemovePostButton report={report} />

            {/* @TODO Maybe only show purge is post is deleted?? */}
            <PurgePostButton report={report} />

            <Divider orientation="vertical" flexItem />

            <BanUserCommunityButton person={report.post_creator} community={report.community} />
            <BanUserSiteButton person={report.post_creator} />
            <PurgeUserSiteButton person={report.post_creator} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <ResolvePostReportButton report={report} />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
