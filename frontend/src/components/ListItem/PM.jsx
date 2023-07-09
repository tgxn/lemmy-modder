import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import DraftsIcon from "@mui/icons-material/Drafts";

import { SquareChip } from "../Display.jsx";

import { ResolvePMReportButton, DeletePMButton } from "../Actions/PMButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";
import { SanitizedLink } from "../Display.jsx";

export default function PMListItem({ report }) {
  return (
    <Badge
      badgeContent={<DraftsIcon fontSize="sm" />}
      color="warning"
      size="md"
      variant="outlined"
      badgeInset="5px 5px 0 0"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiBadge-badge": {
          height: "25px",
        },
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0,
          width: "100%",
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
          <PersonMetaLine creator={report.private_message_creator} />

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

          <ReportDetails report={report.private_message_report} creator={report.creator} />

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
    </Badge>
  );
}
