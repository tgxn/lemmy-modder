import React from "react";

import Moment from "react-moment";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import ForumIcon from "@mui/icons-material/Forum";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { SquareChip } from "../Display.jsx";
import Image from "../Image.jsx";

import { ResolvePostReportButton, RemovePostButton, PurgePostButton } from "../Actions/PostButtons.jsx";

import { BanUserCommunityButton, BanUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";
import { SanitizedLink } from "../Display.jsx";

const PostContentDetail = ({ report }) => {
  return (
    <Box>
      {/* Post Title */}
      <Typography variant="h4" component="h2">
        Post:{" "}
        <SanitizedLink href={report.post.ap_id} target="_blank" rel="noopener noreferrer">
          {report.post.name}
        </SanitizedLink>
      </Typography>

      {/* Post Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
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
            <Moment fromNow>{report.post.published}</Moment>
          </SquareChip>
        )}

        <SquareChip color={"primary"} tooltip="Comments" startDecorator={<ForumIcon />}>
          {report.counts.comments}
        </SquareChip>

        <SquareChip color={"info"} tooltip="Score" startDecorator={<ThumbsUpDownIcon />}>
          {report.counts.score}
        </SquareChip>

        <SquareChip color={"info"} tooltip="Downvotes" startDecorator={<ThumbDownIcon />}>
          {report.counts.downvotes}
        </SquareChip>

        {report.post_report.resolved && (
          <SquareChip
            color={"success"}
            variant="soft"
            tooltip={`Resolved by @${report.resolver.name}`}
            iconOnly={<DoneAllIcon fontSize="small" />}
          />
        )}

        {report.post.removed && (
          <SquareChip
            color={"danger"}
            variant="soft"
            tooltip="Removed"
            iconOnly={<BlockIcon fontSize="small" />}
          />
        )}

        {report.post.deleted && (
          <SquareChip
            color="danger"
            variant="soft"
            tooltip="Deleted"
            iconOnly={<DeleteOutlineIcon fontSize="small" />}
          />
        )}
      </Typography>

      {/* Post Content */}
      <Typography
        variant="body1"
        component="p"
        sx={{
          p: 1,
        }}
      >
        {report.post.body}
      </Typography>
    </Box>
  );
};

export default function PostListItem({ report }) {
  return (
    <React.Fragment>
      {/* Show External Link or Image for URLs */}
      {report.post.url && (
        <Box
          sx={{
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: "auto",
            width: "150px",
            height: "200px",
          }}
        >
          <Image imageSrc={report.post.url} />
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PersonMetaLine creator={report.post_creator} />

        <PostContentDetail report={report} />

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

            <BanUserCommunityButton person={report.post_creator} community={report.community} />
            <BanUserSiteButton person={report.post_creator} />
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
