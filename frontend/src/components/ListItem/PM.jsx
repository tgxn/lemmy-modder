import React from "react";

import Moment from "react-moment";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { SquareChip } from "../Display.jsx";

import { ResolvePMReportButton, DeletePMButton } from "../Actions/PMButtons.jsx";
import { BanUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";
import { SanitizedLink } from "../Display.jsx";

import { PMContentDetail } from "./Content.jsx";

export default function PMListItem({ report }) {
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
      <PersonMetaLine creator={report.private_message_creator} />

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
