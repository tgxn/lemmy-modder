import React from "react";

import Moment from "react-moment";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { SquareChip } from "../Display.jsx";

import { ResolvePMReportButton } from "../Actions/PMButtons.jsx";
import { BanUserSiteButton, PurgeUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";

const PMContentDetail = ({ report }) => {
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

      <PersonMetaLine creator={report.private_message_creator} />

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

export default function PMListItem({ report }) {
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
      <PMContentDetail report={report} />

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
          {/* @TODO  SHOW WHEN IT IS THE OWN USERS CONTENT */}
          {/* <DeletePMButton report={report} /> */}

          <BanUserSiteButton person={report.private_message_creator} />
          <PurgeUserSiteButton person={report.private_message_creator} />
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
  );
}
