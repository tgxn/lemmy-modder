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

export const PostContentDetail = ({ report }) => {
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

export const PMContentDetail = ({ report }) => {
  return (
    <Box>
      {/* PM */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {report.private_message.published && (
          <SquareChip color="neutral" variant="outlined" tooltip={report.private_message.published}>
            <Moment fromNow>{report.private_message.published}</Moment>
          </SquareChip>
        )}

        {report.private_message_report.resolved && (
          <SquareChip
            color={"success"}
            variant="soft"
            tooltip={`Resolved by @${report.resolver.name}`}
            iconOnly={<DoneAllIcon fontSize="small" />}
          />
        )}

        {report.private_message.deleted && (
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
        {report.private_message.content}
      </Typography>

      {/* Report Status */}
      <Typography variant="body1" component="p">
        {report.report_status}
      </Typography>
    </Box>
  );
};

export const CommentContentDetail = ({ report }) => {
  return (
    <Box>
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
          <SquareChip color={"danger"} tooltip="Removed" iconOnly={<DeleteOutlineIcon fontSize="small" />} />
        )}

        {report.comment.deleted && (
          <SquareChip color={"danger"} tooltip="Deleted" iconOnly={<DeleteOutlineIcon fontSize="small" />} />
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
    </Box>
  );
};
