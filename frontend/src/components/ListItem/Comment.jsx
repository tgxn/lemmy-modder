import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";

import ForumIcon from "@mui/icons-material/Forum";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { SquareChip } from "../Display.jsx";
import Image from "../Image.jsx";

import {
  ResolveCommentReportButton,
  RemoveCommentButton,
  PurgeCommentButton,
} from "../Actions/CommentButtons.jsx";

export default function CommentListItem({ report }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
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
        {/* Comment Author */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Typography variant="body3" component="p">
            <Link href={report.comment_creator.actor_id} target="_blank" rel="noopener noreferrer">
              @{report.comment_creator.name}
            </Link>
          </Typography>

          {/* Comment Author Meta */}
          <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
            {report.comment_creator.published && (
              <SquareChip color="neutral" variant="outlined" tooltip={"User Published"}>
                registered <Moment fromNow>{report.comment_creator.published}</Moment>
              </SquareChip>
            )}

            {report.comment_creator.admin && (
              <SquareChip color={"info"} tooltip="User is Site Admin">
                ADMIN
              </SquareChip>
            )}

            {report.comment_creator.banned && <SquareChip color={"danger"}>Banned</SquareChip>}

            {report.comment_creator.bot_account && (
              <SquareChip color={"danger"} tooltip="User is Bot Account">
                BOT
              </SquareChip>
            )}

            {report.comment_creator.deleted && (
              <SquareChip color={"danger"} tooltip="User is Deleted">
                DELETED
              </SquareChip>
            )}
          </Typography>
        </Box>

        {/* Comment Title */}
        <Typography variant="h4" component="h2">
          <Link href={report.comment.ap_id} target="_blank" rel="noopener noreferrer">
            Open Comment
          </Link>
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
            <SquareChip color={"success"} tooltip={`Resolved by @${report.resolver.name}`}>
              Resolved
            </SquareChip>
          )}

          {report.comment.removed && (
            <SquareChip color={"danger"} tooltip="Removed">
              Removed
            </SquareChip>
          )}

          {report.comment.deleted && <SquareChip color={"danger"}>deleted</SquareChip>}
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

        {/* Report Details */}
        <Alert
          variant={"soft"}
          color="warning"
          sx={{
            p: 1,
          }}
        >
          <div>
            <Typography fontWeight="lg">
              <Link
                underline="always"
                color="neutral"
                onClick={() => {
                  //open window
                  window.open(
                    report.creator.actor_id,
                    "_new",
                    // size
                    "width=1300,height=900",
                  );
                }}
              >
                @{report.creator.name} ({report.creator.display_name})
              </Link>
            </Typography>
            <Typography fontSize="sm">{report.comment_report.reason}</Typography>
          </div>
        </Alert>

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
            <RemoveCommentButton report={report} />

            {/* <BanPostUserCommunityButton report={report} />

            <BanPostUserSiteButton report={report} /> */}
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
    </Card>
  );
}
