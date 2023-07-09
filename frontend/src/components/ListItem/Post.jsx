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
  ResolvePostReportButton,
  DeletePostButton,
  RemovePostButton,
  PurgePostButton,
  BanPostUserCommunityButton,
  BanPostUserSiteButton,
} from "../Actions/PostButtons.jsx";

export default function PostListItem({ report }) {
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
        {/* Post Author */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Typography variant="body3" component="p">
            <Link href={report.post_creator.actor_id} target="_blank" rel="noopener noreferrer">
              @{report.post_creator.name}
            </Link>
          </Typography>

          {/* Post Author Meta */}
          <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
            {report.post_creator.published && (
              <SquareChip color="neutral" variant="outlined" tooltip={"User Published"}>
                registered <Moment fromNow>{report.post_creator.published}</Moment>
              </SquareChip>
            )}

            {report.post_creator.admin && (
              <SquareChip color={"info"} tooltip="User is site admin">
                ADMIN
              </SquareChip>
            )}

            {report.post_creator.banned && (
              <SquareChip color={"danger"} tooltip="User is banned">
                B&
              </SquareChip>
            )}

            {report.post_creator.bot_account && (
              <SquareChip color={"danger"} tooltip="User is bot account">
                BOT
              </SquareChip>
            )}

            {report.post_creator.deleted && (
              <SquareChip color={"danger"} tooltip="User is deleted">
                DELETED
              </SquareChip>
            )}
          </Typography>
        </Box>

        {/* Post Title */}
        <Typography variant="h4" component="h2">
          <Link href={report.post.ap_id} target="_blank" rel="noopener noreferrer">
            {report.post.name}
          </Link>
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
            <SquareChip color={"success"} tooltip={`Resolved by @${report.resolver.name}`}>
              Resolved
            </SquareChip>
          )}

          {report.post.removed && (
            <SquareChip color={"danger"} tooltip="Removed">
              Removed
            </SquareChip>
          )}

          {report.post.deleted && <SquareChip color={"danger"}>deleted</SquareChip>}
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

        {/* Report Status */}
        <Typography variant="body1" component="p">
          {report.report_status}
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
            <Typography fontSize="sm">{report.post_report.reason}</Typography>
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
            <RemovePostButton report={report} />

            {/* only show purge is post is deleted */}
            {report.post.removed && <PurgePostButton report={report} />}

            <BanPostUserCommunityButton report={report} />

            <BanPostUserSiteButton report={report} />
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
    </Card>
  );
}
