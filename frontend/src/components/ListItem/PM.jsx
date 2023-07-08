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

import { ResolvePMReportButton, DeletePMButton } from "../Actions/PMButtons.jsx";

export default function PMListItem({ report }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 0,
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
        {/* PM Author */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Typography variant="body3" component="p">
            <Link href={report.private_message_creator.actor_id} target="_blank" rel="noopener noreferrer">
              @{report.private_message_creator.name}
            </Link>
          </Typography>

          {/* PM Author Meta */}
          <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
            {report.private_message_creator.published && (
              <SquareChip color="neutral" variant="outlined" tooltip={"User Published"}>
                registered <Moment fromNow>{report.private_message_creator.published}</Moment>
              </SquareChip>
            )}

            {report.private_message_creator.admin && (
              <SquareChip color={"info"} tooltip="User is Site Admin">
                ADMIN
              </SquareChip>
            )}

            {report.private_message_creator.banned && <SquareChip color={"danger"}>Banned</SquareChip>}

            {report.private_message_creator.bot_account && (
              <SquareChip color={"danger"} tooltip="User is Bot Account">
                BOT
              </SquareChip>
            )}

            {report.private_message_creator.deleted && (
              <SquareChip color={"danger"} tooltip="User is Deleted">
                DELETED
              </SquareChip>
            )}
          </Typography>
        </Box>

        {/* PM */}
        <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
          {report.private_message.published && (
            <SquareChip color="neutral" variant="outlined" tooltip={report.private_message.published}>
              <Moment fromNow>{report.private_message.published}</Moment>
            </SquareChip>
          )}

          {report.private_message_report.resolved && (
            <SquareChip color={"success"} tooltip={`Resolved by @${report.resolver.name}`}>
              Resolved
            </SquareChip>
          )}

          {report.private_message.deleted && <SquareChip color={"danger"}>Deleted</SquareChip>}
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
            <Typography fontSize="sm">{report.private_message_report.reason}</Typography>
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
            {/* @TODO ONLY SHOW WHEN IT IS THE OWN USERS CONTENT */}
            <DeletePMButton report={report} />

            {/* <BanPostUserSiteButton report={report} /> */}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <ResolvePMReportButton report={report} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
